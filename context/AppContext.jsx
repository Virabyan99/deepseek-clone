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
  
  // Add this log to debug session data
  useEffect(() => {
    console.log('Frontend session:', session);
  }, [session]);

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);

  const createNewChat = async () => {
    if (!user?.id) {
      console.error('No user ID available. User object:', user);
      return null;
    }
    try {
      const userId = String(user.id); // Ensure user.id is a string, like in Postman
      console.log('Creating new chat with userId:', userId);
      const result = await createChat(userId);
      console.log('API Response from createChat:', result); // Log full response
      if (result.success && result.chatId) {
        const newChat = { id: result.chatId, name: 'New Chat', user_id: userId, messages: [] };
        setSelectedChat(newChat);
        setChats(prevChats => [...prevChats, newChat]);
        await fetchChatMessages(newChat.id);
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
      console.log('Fetching messages for chat ID:', chatId);
      const result = await getChatMessages(user.id, chatId);
      console.log('Fetched messages result:', result);
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
          await fetchChatMessages(fetchedChats[0].id);
        }
      } else {
        console.error('Error fetching chats:', result.error);
      }
    } catch (error) {
      console.error('Error in fetchUsersChats:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUsersChats();
    }
  }, [user]);

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