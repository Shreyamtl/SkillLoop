import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyRequests } from '../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io('http://localhost:5000');

export default function Chat() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getMyRequests()
      .then((res) => {
        const acceptedReceived = res.data.received.filter(r => r.status === 'accepted');
        const acceptedSent = res.data.sent.filter(r => r.status === 'accepted');
        
        const matchedUsers = [];
        const seenUserIds = new Set();

        acceptedReceived.forEach(r => {
          const userId = r.fromUser._id;
          if (!seenUserIds.has(userId)) {
            seenUserIds.add(userId);
            matchedUsers.push({
              userId: userId,
              name: r.fromUser.name,
              skill: r.skill,
              email: r.fromUser.email,
            });
          }
        });

        acceptedSent.forEach(r => {
          const userId = r.toUser._id;
          if (!seenUserIds.has(userId)) {
            seenUserIds.add(userId);
            matchedUsers.push({
              userId: userId,
              name: r.toUser.name,
              skill: r.skill,
              email: r.toUser.email,
            });
          }
        });

        setMatches(matchedUsers);
      })
      .catch(() => toast.error('Failed to load matches'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit('register', user._id);
    }

    return () => {
      socket.off('receive-message');
    };
  }, [user]);

  useEffect(() => {
    if (selectedMatch) {
      const roomId = getRoomId(user._id, selectedMatch.userId);
      socket.emit('join-chat', roomId);
      
      const savedMessages = JSON.parse(localStorage.getItem(`chat_${roomId}`) || '[]');
      setMessages(savedMessages);
    }
  }, [selectedMatch, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data.fromUser._id === user?._id || data.fromUser === user?._id) {
        return;
      }

      if (selectedMatch) {
        const roomId = getRoomId(user._id, selectedMatch.userId);
        const currentRoomId = getRoomId(data.fromUser._id || data.fromUser, data.toUser._id || data.toUser);
        
        if (roomId === currentRoomId) {
          setMessages(prev => {
            const exists = prev.some(m => 
              m.message === data.message && 
              m.timestamp === data.timestamp
            );
            if (exists) return prev;
            
            const newMessages = [...prev, data];
            localStorage.setItem(`chat_${roomId}`, JSON.stringify(newMessages));
            return newMessages;
          });
        }
      }
    };

    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [selectedMatch, user]);

  const getRoomId = (user1Id, user2Id) => {
    if (!user1Id || !user2Id) return '';
    return [user1Id.toString(), user2Id.toString()].sort().join('-');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch) return;

    const roomId = getRoomId(user._id, selectedMatch.userId);
    const messageData = {
      roomId,
      message: newMessage.trim(),
      fromUser: user._id,
      toUser: selectedMatch.userId,
      timestamp: new Date().toISOString(),
    };

    socket.emit('send-message', messageData);

    const newMsg = {
      ...messageData,
      fromUser: { _id: user._id, name: user.name },
    };
    
    setMessages(prev => {
      const newMessages = [...prev, newMsg];
      localStorage.setItem(`chat_${roomId}`, JSON.stringify(newMessages));
      return newMessages;
    });

    setNewMessage('');
  };

  if (loading) return <p className="text-center py-16">Loading matches...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-1">Messages</h1>
      <p className="text-sm text-gray-500 mb-8">Chat with your skill exchange partners.</p>

      {matches.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No matched users yet. Accept a request to start chatting!</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border rounded-xl p-4 space-y-2 max-h-[500px] overflow-y-auto">
          <h3 className="font-bold text-sm text-gray-500 mb-4">Your Matches</h3>
          {matches.map((match, index) => (
            <button
              key={index}
              onClick={() => setSelectedMatch(match)}
              className={`w-full text-left p-3 rounded-xl transition ${
                selectedMatch?.userId === match.userId
                  ? 'bg-indigo-100 border-indigo-300 border'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold">{match.name}</div>
              <div className="text-xs text-gray-500">Skill: {match.skill}</div>
            </button>
          ))}
        </div>

        <div className="md:col-span-2 border rounded-xl p-4 h-[500px] flex flex-col">
          {selectedMatch ? (
            <>
              <div className="border-b pb-3 mb-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {selectedMatch.name?.[0] || 'U'}
                </div>
                <div>
                  <div className="font-bold">{selectedMatch.name}</div>
                  <div className="text-xs text-gray-500">Skill: {selectedMatch.skill}</div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-8">No messages yet. Say hello!</p>
                )}
                {messages.map((msg, idx) => {
                  const isOwn = msg.fromUser?._id === user?._id || msg.fromUser === user?._id;
                  return (
                    <div
                      key={idx}
                      className={`max-w-[70%] p-3 rounded-xl ${
                        isOwn
                          ? 'ml-auto bg-indigo-600 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.message}</p>
                      <p className={`text-[10px] mt-1 ${isOwn ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </p>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>Select a match to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}