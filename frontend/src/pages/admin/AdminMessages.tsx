import { useEffect, useState } from 'react';
import { MessageSquare, Send, Trash2, Search, User, Package } from 'lucide-react';
import api from '../../api';

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [newMessage, setNewMessage] = useState({ receiverId: '', listingId: '', content: '' });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    loadMessages();
    loadUsers();
    loadListings();
  }, [search]);

  const loadMessages = async () => {
    try {
      const { data } = await api.get(`/admin/messages?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(data.messages);
    } catch (err) {
      console.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data.users);
    } catch (err) {
      console.error('Failed to load users');
    }
  };

  const loadListings = async () => {
    try {
      const { data } = await api.get('/admin/listings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(data.listings);
    } catch (err) {
      console.error('Failed to load listings');
    }
  };

  const sendMessage = async () => {
    try {
      await api.post('/admin/messages', newMessage, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowSendModal(false);
      setNewMessage({ receiverId: '', listingId: '', content: '' });
      loadMessages();
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/admin/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadMessages();
    } catch (err) {
      console.error('Failed to delete message');
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Messages</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Monitor and manage all user communications</p>
        </div>
        <button
          onClick={() => setShowSendModal(true)}
          style={{
            background: 'linear-gradient(135deg,#10b981,#059669)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Send size={16} /> Send Message
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            style={{
              width: '100%',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 10,
              padding: '12px 14px 12px 42px',
              fontSize: 14,
              outline: 'none',
              color: '#f1f5f9'
            }}
          />
        </div>
      </div>

      {/* Messages List */}
      <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #334155' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No messages found</div>
        ) : (
          <div>
            {messages.map((message, i) => (
              <div key={message.id} style={{ 
                padding: '20px', 
                borderBottom: i < messages.length - 1 ? '1px solid #334155' : 'none',
                display: 'flex',
                gap: 16
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={14} color="#64748b" />
                      <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>
                        {message.sender?.name} → {message.receiver?.name}
                      </span>
                    </div>
                    {message.listing && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Package size={14} color="#64748b" />
                        <span style={{ fontSize: 12, color: '#64748b' }}>{message.listing.title}</span>
                      </div>
                    )}
                    <span style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.5 }}>
                    {message.content}
                  </div>
                </div>
                <button
                  onClick={() => deleteMessage(message.id)}
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 8,
                    padding: '8px',
                    cursor: 'pointer',
                    color: '#f87171'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Message Modal */}
      {showSendModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e293b',
            borderRadius: 14,
            padding: '24px',
            width: '100%',
            maxWidth: 500,
            border: '1px solid #334155'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Send Message</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#64748b', marginBottom: 6, display: 'block' }}>Recipient</label>
              <select
                value={newMessage.receiverId}
                onChange={(e) => setNewMessage({ ...newMessage, receiverId: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: '10px',
                  color: '#f1f5f9',
                  fontSize: 14
                }}
              >
                <option value="">Select user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#64748b', marginBottom: 6, display: 'block' }}>Related Listing (Optional)</label>
              <select
                value={newMessage.listingId}
                onChange={(e) => setNewMessage({ ...newMessage, listingId: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: '10px',
                  color: '#f1f5f9',
                  fontSize: 14
                }}
              >
                <option value="">No listing</option>
                {listings.map(listing => (
                  <option key={listing.id} value={listing.id}>{listing.title}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#64748b', marginBottom: 6, display: 'block' }}>Message</label>
              <textarea
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                placeholder="Type your message..."
                rows={4}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: '10px',
                  color: '#f1f5f9',
                  fontSize: 14,
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSendModal(false)}
                style={{
                  background: '#374151',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 16px',
                  color: '#d1d5db',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                disabled={!newMessage.receiverId || !newMessage.content}
                style={{
                  background: 'linear-gradient(135deg,#10b981,#059669)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 16px',
                  color: '#fff',
                  cursor: 'pointer',
                  opacity: (!newMessage.receiverId || !newMessage.content) ? 0.5 : 1
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}