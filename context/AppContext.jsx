//context\AppContext.jsx
"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { createChat, getChats, getChatMessages } from '@/lib/api';

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const { data: session } = useSession();
  const user = session?.user;



  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);

  const createNewChat = async () => {
    if (!user?.id) {
      console.error('No user ID available. User object:', user);
      return null;
    }
    try {
      const userId = String(user.id); // Ensure user.id is a string, consistent with Postman
      const result = await createChat(userId);
      if (result.success && result.chatId) {
        const newChat = { id: result.chatId, name: 'New Chat', user_id: userId, messages: [] };
        setChats(prevChats => [...prevChats, newChat]);
        setSelectedChat(newChat);
        return newChat;
      } else {
        console.error('Chat creation failed. API response:', result);
        return null;
      }
    } catch (error) {
      console.error('Error in createNewChat:', error);
      return null;
    }
  };

  const fetchChatMessages = async (chatId) => {
    if (!user?.id || !chatId) return;
    try {
      const result = await getChatMessages(user.id, chatId);
      if (result.success) {
        setSelectedChatMessages(result.data);
      } else {
        console.error('Error fetching messages:', result.error);
      }
    } catch (error) {
      console.error('Error in fetchChatMessages:', error);
    }
  };

  const fetchUsersChats = async () => {
    if (!user?.id) return;
    try {
      const result = await getChats(user.id);
      if (result.success) {
        const fetchedChats = result.data.map(chat => ({ ...chat, messages: [] }));
        setChats(fetchedChats);
        if (fetchedChats.length > 0) {
          setSelectedChat(fetchedChats[0]);
        } else {
          setSelectedChat(null);
          setSelectedChatMessages([]);
        }
      } else {
        console.error('Error fetching chats:', result.error);
      }
    } catch (error) {
      console.error('Error in fetchUsersChats:', error);
    }
  };

  // Fetch chats when user is available
  useEffect(() => {
    if (user?.id) {
      fetchUsersChats();
    }
  }, [user]);

  // Fetch messages whenever selectedChat changes
  useEffect(() => {
    if (selectedChat && user?.id) {
      fetchChatMessages(selectedChat.id);
    } else {
      setSelectedChatMessages([]);
    }
  }, [selectedChat, user?.id]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    selectedChatMessages,
    setSelectedChatMessages,
    fetchUsersChats,
    createNewChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};