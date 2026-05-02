import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSocket = (projectId, deploymentId) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeLogs, setRealTimeLogs] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      
      // Join project room or deployment room
      if (deploymentId) {
        socketRef.current.emit('join-project', deploymentId);
      }
    });

    socketRef.current.on('log-update', (log) => {
      setRealTimeLogs((prev) => [...prev, log]);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [deploymentId]);

  return { isConnected, realTimeLogs, setRealTimeLogs };
};
