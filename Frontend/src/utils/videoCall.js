// utils/videoCall.js
import DailyIframe from "@daily-co/daily-js";

/**
 * Starts a video call by:
 * 1. Creating a Daily room via backend
 * 2. Emitting socket event to the recipient
 * 3. Joining the room using Daily iframe
 */
export const startVideoCall = async ({ socket, fromUserId, toUserId }) => {
  try {
    // 1. Call backend to create a Daily room
    const res = await fetch("/api/create-room", { method: "POST" });
    const { url } = await res.json();

    // 2. Send room info to receiver using socket
    socket.emit("start-video-call", {
      to: toUserId,
      from: fromUserId,
      roomUrl: url,
    });

    // 3. Join the room using Daily iframe
    const callFrame = DailyIframe.createFrame({
      iframeStyle: {
        position: "fixed",
        width: "100%",
        height: "100%",
        top: "0px",
        left: "0px",
        border: "0",
        zIndex: 9999,
      },
      showLeaveButton: true,
    });

    await callFrame.join({ url });
  } catch (err) {
    console.error("Failed to start call:", err);
  }
};
export const handleIncomingCall = ({ roomUrl }) => {
  const accept = window.confirm("Incoming video call. Accept?");
  if (accept) {
    const callFrame = DailyIframe.createFrame({
      iframeStyle: {
        position: "fixed",
        width: "100%",
        height: "100%",
        top: "0px",
        left: "0px",
        border: "0",
        zIndex: 9999,
      },
      showLeaveButton: true,
    });
    callFrame.join({ url: roomUrl });
  }
};
