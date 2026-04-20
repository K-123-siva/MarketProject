import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import api from '../api';
import { useAuthStore } from '../store/authStore';
import { Message } from '../types';

let socket: Socket;

export default function ChatPage() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('sellerId');
  const listingId = searchParams.get('listingId');
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    socket = io('http://localhost:5000');
    socket.emit('join', user.id);
    socket.on('newMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => { socket.disconnect(); };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    api.get('/messages').then(({ data }) => {
      const filtered = data.filter((m: Message) =>
        (m.senderId === user.id && m.receiverId === Number(sellerId)) ||
        (m.receiverId === user.id && m.senderId === Number(sellerId))
      );
      setMessages(filtered);
    });
  }, [user, sellerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !user || !sellerId) return;
    socket.emit('sendMessage', { senderId: user.id, receiverId: Number(sellerId), message: text, listingId: Number(listingId) });
    setText('');
  };

  if (!user) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">Please login to use chat</p>
      <Link to="/login" className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold">Login</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Chat with Seller</h1>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">No messages yet. Start the conversation!</p>}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.senderId === user.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-gray-100 p-3 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-400" />
          <button onClick={sendMessage} className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
