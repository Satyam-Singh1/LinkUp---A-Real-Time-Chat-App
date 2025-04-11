import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async(req , res)=>{
try{
    const loggedInUserId = req.user._id;
    //Get all the users except the current user whose account is opened and get everything of other user except their passwords
    const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

   res.status(200).json(filteredUsers)

}catch(Err){
   console.error("Error in getUserForSidebar : ",Err.message);
   res.send(500).json({error:"Internal Server Error"});
}
} 

export const getMessages = async(req, res)=>{
  try{
       const {id:userToChatId }= req.params
       const myId = req.user._id;

       const messages = await Message.find({
        $or:[
          {senderId:myId, receiverId:userToChatId},
          {senderId:userToChatId , receiverId:myId}
        ]
       })

       res.status(200).json(messages);
  }catch(err){
    console.error("Error in getUserForSidebar : ",err.message);
    res.send(500).json({error:"Internal Server Error"});
  }
}

export const sendMessage = async(req , res)=>{
  try {
      const {text , image} = req.body;
      const {id:receiverId} = req.params;
      
      const senderId = req.user._id;

      let imageUrl;
      if(image){
        //upload the send image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
        
      const newMessage = new Message({
        senderId, 
        receiverId,
        text,
        image:imageUrl,
      });
      
      await newMessage.save();
      
      //todo: Real time functionality goes here
      const receiverSocketId = getReceiverSocketId(receiverId);

      if(receiverSocketId){
         io.to(receiverSocketId).emit("newMessage",newMessage);
      }


      res.status(201).json(newMessage);
  
  } catch (error) {
    console.error("Error in sendMessage Controller : ",error.message);
    res.send(500).json({error:"Internal Server Error"});
  }
}