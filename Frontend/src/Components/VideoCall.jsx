import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import toast from "react-hot-toast";
import { Loader, Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const VideoCall = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [streamToken, setStreamToken] = useState(null);

  // Fetch Stream token from your backend
  const fetchStreamToken = async () => {
    try {
      const response = await fetch(`https://linkup-a-real-time-chat-app.onrender.com/api/stream/token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Stream token');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Stream token:", error);
      toast.error("Failed to get video call token");
      return null;
    }
  };

  useEffect(() => {
    const initCall = async () => {
      if (!authUser || !callId) return;

      try {
        console.log("Fetching Stream token...");
        const tokenData = await fetchStreamToken();   
        if (!tokenData || !tokenData.token) {
          throw new Error("No token received");
        }

        setStreamToken(tokenData);
        console.log("Initializing Stream video client...");
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.fullName)}`,
        };

        const videoClient = new StreamVideoClient({
          apiKey: tokenData.apiKey,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        console.log("Joined call successfully");
        setClient(videoClient);
        setCall(callInstance);
        
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
        navigate("/");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    // Cleanup function
    return () => {
      if (call) {
        call.leave();
      }
      if (client) {
        client.disconnectUser();
      }
    };
  }, [authUser, callId, navigate]);

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="flex flex-col items-center gap-4">
          <Loader className="size-10 animate-spin text-primary" />
          <p className="text-base-content">Joining call...</p>
        </div>
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="text-center">
          <p className="text-base-content mb-4">Could not initialize call. Please refresh or try again later.</p>
          <button 
            onClick={() => navigate("/")} 
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallContent />
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <div className="h-screen flex flex-col">
      <StreamTheme className="flex-1">
        <div className="relative h-full">
          <SpeakerLayout />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <CallControls />
          </div>
        </div>
      </StreamTheme>
    </div>
  );
};

export default VideoCall;