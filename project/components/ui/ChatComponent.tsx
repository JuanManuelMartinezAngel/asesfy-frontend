"use client";

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile } from 'lucide-react';

const socket = io('http://localhost:3001');

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on('mensaje', (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('mensaje');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('mensaje', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-[400px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">¡Comienza la conversación!</p>
              <p className="text-sm">Escribe un mensaje para empezar a chatear</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="flex justify-end">
              <div className="max-w-xs lg:max-w-md px-4 py-2 bg-[#0A1B3D] text-white rounded-lg rounded-br-none shadow-sm">
                <p className="text-sm">{msg}</p>
                <span className="text-xs text-gray-300 mt-1 block">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Escribe un mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-20 py-3 resize-none border-gray-300 focus:border-[#0A1B3D] focus:ring-[#0A1B3D]"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>
          </div>
          <Button 
            onClick={sendMessage}
            disabled={!message.trim()}
            className="bg-[#0A1B3D] hover:bg-[#0A1B3D]/90 px-4 py-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Presiona Enter para enviar</span>
          <span>{message.length}/1000</span>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent; 