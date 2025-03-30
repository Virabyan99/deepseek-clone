// lib/api.js
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Create a chat
export async function createChat(userId) {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({ userId }),
  });
  return await response.json();
}

// Get user’s chats
export async function getChats(userId) {
  const response = await fetch(`${BACKEND_URL}/api/chat?userId=${userId}`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });
  return await response.json();
}

// Delete a chat
export async function deleteChat(chatId, userId) {
  const response = await fetch(`${BACKEND_URL}/api/chat/${chatId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({ userId }),
  });
  return await response.json();
}

// Rename a chat
export async function renameChat(chatId, userId, name) {
  const response = await fetch(`${BACKEND_URL}/api/chat/${chatId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({ userId, name }),
  });
  return await response.json();
}

// Send a message and get response
export async function sendMessage(userId, chatId, prompt) {
  const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({ userId, chatId, prompt }),
  });
  return await response.json();
}