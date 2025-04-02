//file to generate jwt tocken which we need each time we create a new user or logged in
//TO create jwt token we need a environment variable 

import jwt from "jsonwebtoken"
import dotenv from "dotenv"
export const generateToken = (userId,res)=>{
  const token = jwt.sign({userId} , process.env.JWT_SECRET,{expiresIn:"7d"})

  res.cookie("jwt",token,{
    //max age of token is 7 days so write it in maxAge but in milisecond form
    maxAge:7*24*60*60*1000,
    httpOnly:true, //to prevent attack
    sameSite:"strict",
    secure:process.env.NODE_ENV !=="development",
  });
  return token; 
};