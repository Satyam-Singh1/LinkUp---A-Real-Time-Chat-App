import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

export const getStreamToken = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    
    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      console.error("Stream API credentials missing");
      return res.status(500).json({ 
        error: "Stream API credentials not configured" 
      });
    }

    console.log("Generating Stream token for user:", userId);

    // Initialize Stream Chat client (used for generating tokens for both chat and video)
    const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
    
    // Generate token for the user
    const token = serverClient.createToken(userId);
    
    console.log("Stream token generated successfully");
    
    res.status(200).json({ 
      token,
      apiKey: STREAM_API_KEY,
      userId 
    });
    
  } catch (error) {
    console.error("Error generating Stream token:", error);
    res.status(500).json({ 
      error: "Failed to generate Stream token",
      details: error.message 
    });
  }
};