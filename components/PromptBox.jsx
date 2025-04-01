'use client';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { sendMessage } from '@/lib/api';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const PromptBox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef(null);
  const {
    user,
    selectedChat,
    setSelectedChat,
    selectedChatMessages,
    setSelectedChatMessages,
    createNewChat,
  } = useAppContext();

  // Adjust textarea height whenever prompt changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to content height
    }
  }, [prompt]);

  const sendPrompt = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login to Send Message');
    if (isLoading) return toast.error('Please wait, processing...');
  
    setIsLoading(true);
    const promptCopy = prompt;
    setPrompt('');
  
    try {
      let currentChat = selectedChat;
      if (!currentChat) {
        currentChat = await createNewChat();
        if (!currentChat) {
          console.error('Chat creation failed');
          toast.error('Failed to create a chat');
          setIsLoading(false);
          return;
        }
        setSelectedChat(currentChat);
        toast.success('Chat created successfully!');
      }
  
      const userMessage = {
        role: 'user',
        content: promptCopy,
        timestamp: Date.now(),
      };
      setSelectedChatMessages((prev) => [...prev, userMessage]);
  
      const result = await sendMessage(user.id, currentChat.id, promptCopy);
  
      if (result.success) {
        const assistantMessage = result.data;
        let displayedMessage = {
          role: 'assistant',
          content: '',
          timestamp: assistantMessage.timestamp,
        };
        setSelectedChatMessages((prev) => [...prev, displayedMessage]);
  
        const messageTokens = assistantMessage.content.split(' ');
        messageTokens.forEach((token, i) => {
          setTimeout(() => {
            displayedMessage.content += (i > 0 ? ' ' : '') + token;
            setSelectedChatMessages((prev) => {
              const updatedMessages = [...prev];
              updatedMessages[updatedMessages.length - 1] = { ...displayedMessage };
              return updatedMessages;
            });
          }, i * 100);
        });
      } else {
        console.error('sendMessage failed:', result.error);
        toast.error(result.error || 'Failed to get response');
        setSelectedChatMessages((prev) => prev.slice(0, -1));
        setPrompt(promptCopy);
      }
    } catch (error) {
      console.error('Error in sendPrompt:', error);
      toast.error('Something went wrong');
      setSelectedChatMessages((prev) => prev.slice(0, -1));
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${selectedChat?.messages.length > 0 ? 'max-w-3xl' : 'max-w-2xl'} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        placeholder="Message DeepSeek"
        required
        className="outline-none w-full resize-none break-words bg-transparent"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        ref={textareaRef}
        style={{ maxHeight: '200px', overflowY: 'auto' }}
      />
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.deepthink_icon} alt="deepthink" className="h-5" />
            DeepThink (R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.search_icon} alt="search" className="h-5" />
            Search
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="pin" />
          <button
            type="submit"
            className={`${prompt ? 'bg-primary' : 'bg-[#71717a]'} rounded-full p-2 cursor-pointer`}
          >
            <Image
              className="w-3.5 aspect-square"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt="arrow icon"
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;