import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3004', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect_error', (err) => {
     return ('Connection Error:', err.message);
    });

    newSocket.on('connect', () => {
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
