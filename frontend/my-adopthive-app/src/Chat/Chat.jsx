
import { useContext, useEffect, useState } from 'react';
import { useSocket } from '../SocketContext';
import { UserContext } from '../UserContext';
import PropTypes from 'prop-types';
import './Chat.css';

function Chat({ receiverId }) {
  const socket = useSocket();
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket && user && receiverId) {
      const room = [user.id, receiverId].sort().join('-');

      socket.emit('joinRoom', { room });

      socket.on('receiveMessage', (newMessage) => {
        if (newMessage.receiverId === user.id || newMessage.senderId === user.id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, user, receiverId]);

  const handleSendMessage = () => {
    if (message.trim() && socket && user && receiverId) {
      const room = [user.id, receiverId].sort().join('-');

      socket.emit('sendMessage', {
        senderId: user.id,
        receiverId,
        message,
        room
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div id="messages">
        <h2>Chats</h2>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
          >
            <strong>{msg.senderId === user.id ? 'Me' : 'User ' + msg.senderId}</strong>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

Chat.propTypes = {
  receiverId: PropTypes.number.isRequired,
};

export default Chat;
