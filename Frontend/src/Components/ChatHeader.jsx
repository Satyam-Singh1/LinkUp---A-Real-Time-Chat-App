import { X, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import CallButton from "./CallButton";

export const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const {  onlineUsers } = useAuthStore();


  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Left: User Info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

       
        <div className="flex items-center gap-2">
          {/* Video Call Button */}
          <CallButton 
  receiverId={selectedUser._id} 
  receiverName={selectedUser.fullName} 
/>

          {/* Close Chat */}
          <button onClick={() => setSelectedUser(null)} title="Close Chat">
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

