import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, Phone, Video } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import api from '../api';
import { useAuthStore } from '../store/authStore';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  message: string; // Changed from 'content' to 'message'
  listingId?: number;
  createdAt: string;
  sender?: { id: number; name: string; email: string };
  receiver?: { id: number; name: string; email: string };
  listing?: { id: number; title: string };
}

let socket: Socket;

export default function ChatPage() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('sellerId');
  const listingId = searchParams.get('listingId');
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    // Initialize socket connection
    socket = io('http://localhost:5000');
    socket.emit('join', user.id);
    
    socket.on('newMessage', (msg: Message) => {
      console.log('New message received:', msg);
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.find(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on('messageError', (error) => {
      console.error('Message error:', error);
      alert('Failed to send message');
    });
    
    return () => { 
      socket.disconnect(); 
    };
  }, [user]);

  useEffect(() => {
    if (!user || !sellerId) return;
    
    setLoading(true);
    
    // Load messages
    api.get('/messages', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      const filtered = data.filter((m: Message) =>
        (m.senderId === user.id && m.receiverId === Number(sellerId)) ||
        (m.receiverId === user.id && m.senderId === Number(sellerId))
      );
      setMessages(filtered);
      
      // Get other user info
      if (filtered.length > 0) {
        const otherUserId = Number(sellerId);
        const otherUserData = filtered.find((m: any) => 
          m.senderId === otherUserId ? m.sender : 
          m.receiverId === otherUserId ? m.receiver : null
        );
        if (otherUserData) {
          setOtherUser(otherUserData.senderId === otherUserId ? otherUserData.sender : otherUserData.receiver);
        }
      }
      
      // If no messages, try to get user info from API
      if (filtered.length === 0) {
        api.get(`/admin/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(({ data }) => {
          const foundUser = data.users?.find((u: any) => u.id === Number(sellerId));
          if (foundUser) setOtherUser(foundUser);
        }).catch(() => {
          setOtherUser({ id: Number(sellerId), name: 'User', email: '' });
        });
      }
    }).catch(err => {
      console.error('Failed to load messages:', err);
    }).finally(() => {
      setLoading(false);
    });
  }, [user, sellerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !user || !sellerId) return;
    
    console.log('Sending message:', { 
      senderId: user.id, 
      receiverId: Number(sellerId), 
      message: text, 
      listingId: listingId ? Number(listingId) : null 
    });
    
    socket.emit('sendMessage', { 
      senderId: user.id, 
      receiverId: Number(sellerId), 
      message: text, 
      listingId: listingId ? Number(listingId) : null 
    });
    
    setText('');
  };

  const makeCall = () => {
    alert('Voice call feature coming soon!');
  };

  const makeVideoCall = () => {
    alert('Video call feature coming soon!');
  };

  if (!user) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ color: '#64748b', marginBottom: 16, fontSize: 16 }}>Please login to use chat</p>
      <Link to="/login" style={{ 
        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', 
        color: '#fff', 
        padding: '12px 24px', 
        borderRadius: 10, 
        textDecoration: 'none', 
        fontWeight: 600 
      }}>
        Login
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
        Loading chat...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      {/* Chat Header */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '16px 16px 0 0', 
        padding: '20px 24px', 
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
            Chat with {otherUser?.name || 'User'}
          </h1>
          {otherUser?.email && (
            <p style={{ fontSize: 14, color: '#64748b' }}>{otherUser.email}</p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={makeCall}
            style={{
              background: 'linear-gradient(135deg,#10b981,#059669)',
              border: 'none',
              borderRadius: 10,
              padding: '10px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Phone size={18} />
          </button>
          <button
            onClick={makeVideoCall}
            style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              border: 'none',
              borderRadius: 10,
              padding: '10px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Video size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ 
        background: '#fff', 
        height: 400, 
        overflowY: 'auto', 
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        {messages.length === 0 && (
          <p style={{ 
            textAlign: 'center', 
            color: '#94a3b8', 
            fontSize: 14, 
            marginTop: 40 
          }}>
            No messages yet. Start the conversation!
          </p>
        )}
        
        {messages.map((msg, i) => {
          const isOwn = msg.senderId === user.id;
          return (
            <div key={msg.id || i} style={{ 
              display: 'flex', 
              justifyContent: isOwn ? 'flex-end' : 'flex-start' 
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: isOwn ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f1f5f9',
                color: isOwn ? '#fff' : '#1e293b',
                fontSize: 14,
                lineHeight: 1.4
              }}>
                {msg.message}
                <div style={{ 
                  fontSize: 11, 
                  opacity: 0.7, 
                  marginTop: 4,
                  textAlign: 'right'
                }}>
                  {new Date(msg.createdAt).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Message Input */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '0 0 16px 16px', 
        borderTop: '1px solid #e2e8f0', 
        padding: '16px 24px',
        display: 'flex',
        gap: 12
      }}>
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
          placeholder="Type a message..." 
          style={{ 
            flex: 1, 
            border: '1px solid #d1d5db', 
            borderRadius: 12, 
            padding: '12px 16px', 
            fontSize: 14, 
            outline: 'none',
            background: '#f9fafb'
          }}
        />
        <button 
          onClick={sendMessage}
          disabled={!text.trim()}
          style={{ 
            background: text.trim() ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#d1d5db',
            color: '#fff', 
            border: 'none',
            borderRadius: 12, 
            padding: '12px 16px', 
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
