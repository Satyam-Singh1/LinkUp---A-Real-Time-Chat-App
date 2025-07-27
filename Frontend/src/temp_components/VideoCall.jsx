import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const VideoCallListener = () => {
  const { socket } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on("incoming-video-call", ({ roomUrl }) => {
      navigate(`/video/${roomUrl}`);
    });

    return () => socket.off("incoming-video-call");
  }, [socket, navigate]);

  return null; // no UI needed
};

export default VideoCallListener;
