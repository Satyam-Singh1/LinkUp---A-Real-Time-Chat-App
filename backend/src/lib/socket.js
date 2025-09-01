import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "https://68a94c86902af1567973a7bc--linkupfrontend.netlify.app",
      "https://68b472f30187f0f1f1c55981--linkupchatapp.netlify.app",
      "https://satyam-singh1.github.io"
    ],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Video call events
  socket.on("callUser", (data) => {
    const { userToCall, signalData, from, name, callId } = data;
    const receiverSocketId = getReceiverSocketId(userToCall);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callUser", {
        signal: signalData,
        from,
        name,
        callId
      });
    }
  });

  socket.on("answerCall", (data) => {
    const { to, signal } = data;
    const callerSocketId = getReceiverSocketId(to);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", signal);
    }
  });

  socket.on("rejectCall", (data) => {
    const { to } = data;
    const callerSocketId = getReceiverSocketId(to);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit("callRejected");
    }
  });

  socket.on("endCall", (data) => {
    const { to } = data;
    const receiverSocketId = getReceiverSocketId(to);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callEnded");
    }
  });

  // Video call events
  socket.on("initiateCall", (data) => {
    const { receiverId, callId, callerInfo } = data;
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    console.log(`Call initiated by ${callerInfo.name} for ${receiverId}`);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incomingCall", {
        callId,
        caller: callerInfo,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on("acceptCall", (data) => {
    const { callId, callerId } = data;
    const callerSocketId = getReceiverSocketId(callerId);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", { callId });
    }
  });

  socket.on("rejectCall", (data) => {
    const { callId, callerId } = data;
    const callerSocketId = getReceiverSocketId(callerId);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit("callRejected", { callId });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };