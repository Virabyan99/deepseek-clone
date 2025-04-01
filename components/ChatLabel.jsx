//components\ChatLabel.jsx
'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { deleteChat, renameChat } from '@/lib/api';

const ChatLabel = ({ id, name, openMenu, setOpenMenu }) => {
  const { chats, setChats, setSelectedChat } = useAppContext();
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState(name);

  const selectChat = () => {
    const chatData = chats.find((chat) => chat.id === id);
    if (chatData) {
      setSelectedChat(chatData);
    }
  };

  const renameHandler = () => {
    setIsRenameModalOpen(true);
  };

  const deleteHandler = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div
        onClick={selectChat}
        className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer"
      >
        <p className="group-hover:max-w-5/6 truncate">{name}</p>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu((prev) =>
              prev.id === id && prev.open
                ? { id: 0, open: false }
                : { id, open: true }
            );
          }}
          className="group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg"
        >
          <Image
            src={assets.three_dots}
            alt="dots"
            className={`w-4 ${
              openMenu.id === id && openMenu.open ? 'block' : 'hidden'
            } group-hover:block`}
          />
          <div
            className={`absolute ${
              openMenu.id === id && openMenu.open ? 'block' : 'hidden'
            } -right-36 top-6 bg-gray-700 rounded-xl w-max p-2`}
          >
            <div
              onClick={renameHandler}
              className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg"
            >
              <Image src={assets.pencil_icon} alt="pencil" className="w-4" />
              <p>Rename</p>
            </div>
            <div
              onClick={deleteHandler}
              className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg"
            >
              <Image src={assets.delete_icon} alt="delete" className="w-4" />
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      {isRenameModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsRenameModalOpen(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Rename Chat</h2>
            <input
              type="text"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded mb-4 bg-gray-700 text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsRenameModalOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (newChatName && newChatName !== name) {
                    try {
                      const userId = chats.find((chat) => chat.id === id)?.user_id;
                      const result = await renameChat(id, userId, newChatName);
                      if (result.success) {
                        setChats((prev) =>
                          prev.map((chat) =>
                            chat.id === id ? { ...chat, name: newChatName } : chat
                          )
                        );
                        setIsRenameModalOpen(false);
                        setOpenMenu({ id: 0, open: false });
                      }
                    } catch (error) {
                      console.error('Error renaming chat:', error);
                    }
                  }
                }}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this chat?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                No
              </button>
              <button
                onClick={async () => {
                  try {
                    const userId = chats.find((chat) => chat.id === id)?.user_id;
                    const result = await deleteChat(id, userId);
                    if (result.success) {
                      setChats((prev) => prev.filter((chat) => chat.id !== id));
                      setIsDeleteModalOpen(false);
                      setOpenMenu({ id: 0, open: false });
                    }
                  } catch (error) {
                    console.error('Error deleting chat:', error);
                  }
                }}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatLabel;