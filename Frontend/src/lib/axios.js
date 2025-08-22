import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://linkup-a-real-time-chat-app.onrender.com/api/",
  withCredentials: true,
});

