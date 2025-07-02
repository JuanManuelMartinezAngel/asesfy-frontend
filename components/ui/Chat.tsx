import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const socket = io('http://localhost:3000'); // Cambiar a la URL del servidor de chat

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('message', (message: string) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('message', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded mb-2">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow mr-2"
        />
        <Button onClick={sendMessage} className="bg-blue-500 text-white">
          Enviar
        </Button>
      </div>
    </div>
  );
} 