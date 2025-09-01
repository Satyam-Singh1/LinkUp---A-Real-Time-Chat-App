import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "https://linkup-a-real-time-chat-app.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  incomingCall: null, // Add incoming call state

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) { 
      console.log("Error in checkAuth:", error);
      set({ authUser: null }); 
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, incomingCall: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Call-related actions
  initiateCall: (receiverId, callId) => {
    const { socket, authUser } = get();
    if (socket && authUser) {
      socket.emit("initiateCall", {
        receiverId,
        callId,
        callerInfo: {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic
        }
      });
    }
  },

  acceptCall: () => {
    set({ incomingCall: null });
  },

  rejectCall: () => {
    set({ incomingCall: null });
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.connect();
    set({ socket: socket }); 

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // Handle incoming call notifications
    socket.on("incomingCall", (callData) => {
      console.log("Incoming call received:", callData);
      set({ incomingCall: callData });
      
      // Play notification sound (optional)
      const audio = new Audio("/notification-sound.mp3");
      audio.play().catch(e => console.log("Could not play notification sound"));
    });

    socket.on("callAccepted", (data) => {
      console.log("Call was accepted:", data);
      toast.success("Call accepted!");
    });

    socket.on("callRejected", (data) => {
      console.log("Call was rejected:", data);
      toast.info("Call was declined");
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));