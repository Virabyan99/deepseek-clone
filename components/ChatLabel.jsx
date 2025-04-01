'use client';
import { useAppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { deleteChat, renameChat } from '@/lib/api';

const ChatLabel = ({ id, name, openMenu, setOpenMenu }) => {
  const { chats, setChats, setSelectedChat } = useAppContext();

  const selectChat = () => {
    const chatData = chats.find((chat) => chat.id === id);
    if (chatData) {
      setSelectedChat(chatData);
    }
  };

  const renameHandler = async () => {
    const newName = prompt('Enter new chat name:', name);
    if (newName && newName !== name) {
      try {
        const userId = chats.find((chat) => chat.id === id)?.user_id;
        const result = await renameChat(id, userId, newName);
        if (result.success) {
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === id ? { ...chat, name: newName } : chat
            )
          );
          setOpenMenu({ id: 0, open: false });
        }
      } catch (error) {
        console.error('Error renaming chat:', error);
      }
    }
  };

  const deleteHandler = async () => {
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        const userId = chats.find((chat) => chat.id === id)?.user_id;
        const result = await deleteChat(id, userId);
        if (result.success) {
          setChats((prev) => prev.filter((chat) => chat.id !== id));
          setOpenMenu({ id: 0, open: false });
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
  };

  return (
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
  );
};

export default ChatLabel;