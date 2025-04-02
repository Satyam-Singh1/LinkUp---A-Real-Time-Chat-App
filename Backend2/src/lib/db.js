import mongoose from "mongoose";
import dotenv from "dotenv";


export const connectDB = async ()=>{
  try{
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDb connected :${conn.connection.host}`);
  }catch(err){
      console.log(err)
  }
}