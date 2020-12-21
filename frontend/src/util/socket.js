import io from "socket.io-client";

export const socket = io('http://localhost:5001/api/socket', {
    'multiplex': false, transports: ['websocket'], forceNew: true
  });