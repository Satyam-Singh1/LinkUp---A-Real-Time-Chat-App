import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, PhoneOff, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

const IncomingCallModal = ({ incomingCall, onAccept, onReject }) => {
  const navigate = useNavigate();
  const { socket } = useAuthStore();
  const [isAccepting, setIsAccepting] = useState(false);

  if (!incomingCall) return null;

  const handleAccept = async () => {
    setIsAccepting(true);
    
    // Emit accept call event
    socket?.emit("acceptCall", {
      callId: incomingCall.callId,
      callerId: incomingCall.caller.id
    });
    
    // Navigate to call page
    navigate(`/call/${incomingCall.callId}`);
    
    onAccept();
  };

  const handleReject = () => {
    // Emit reject call event
    socket?.emit("rejectCall", {
      callId: incomingCall.callId,
      callerId: incomingCall.caller.id
    });
    
    onReject();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-base-100 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl border border-base-300">
        <div className="text-center">
          {/* Caller Avatar */}
          <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
            <img
              src={incomingCall.caller.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(incomingCall.caller.name)}`}
              alt={incomingCall.caller.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Caller Info */}
          <h3 className="text-xl font-semibold text-base-content mb-2">
            {incomingCall.caller.name}
          </h3>
          <p className="text-base-content/70 mb-6">Incoming video call...</p>
          
          {/* Call Animation */}
          <div className="flex justify-center mb-6">
            <Video className="w-8 h-8 text-primary animate-pulse" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {/* Reject Button */}
            <button
              onClick={handleReject}
              className="btn btn-circle btn-error btn-lg shadow-lg hover:scale-105 transition-transform"
              disabled={isAccepting}
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            
            {/* Accept Button */}
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="btn btn-circle btn-success btn-lg shadow-lg hover:scale-105 transition-transform"
            >
              {isAccepting ? (
                <div className="loading loading-spinner loading-sm"></div>
              ) : (
                <Phone className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;