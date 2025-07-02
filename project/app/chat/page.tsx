import React from 'react';
import ChatComponent from '@/components/ui/ChatComponent';

const ChatPage = () => {
  return (
    <div className="chat-page-container p-6">
      <h1 className="text-2xl font-bold mb-4">Chat con Clientes</h1>
      {/* Espacio para búsqueda de clientes y otras funcionalidades */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar clientes..."
          className="p-2 border rounded w-full"
        />
      </div>
      <ChatComponent />
    </div>
  );
};

export default ChatPage;