import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import toast from "react-hot-toast";

const CallButton = ({ receiverId, receiverName }) => {
  const navigate = useNavigate();
  const { initiateCall } = useAuthStore();
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);

  const initiateVideoCall = async () => {
    if (isInitiatingCall) return;
    
    setIsInitiatingCall(true);
    
    try {
      // Generate a unique call ID
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Notify the receiver about the incoming call
      initiateCall(receiverId, callId);
      
      // Navigate to the call page
      navigate(`/call/${callId}`);
      
      toast.success(`Calling ${receiverName}...`);
      
    } catch (error) {
      console.error("Error initiating call:", error);
      toast.error("Failed to start video call");
    } finally {
      setIsInitiatingCall(false);
    }
  };

  return (
    <button
      onClick={initiateVideoCall}
      disabled={isInitiatingCall}
      className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
      title={`Video call ${receiverName}`}
    >
      {isInitiatingCall ? (
        <div className="loading loading-spinner loading-xs"></div>
      ) : (
        <Video className="size-4" />
      )}
    </button>
  );
};

export default CallButton;