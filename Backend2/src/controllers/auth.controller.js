
import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
  const {fullName , email , password} = req.body;
  try{
     //Check if the user already exists and valid or not
     if(!fullName || !email || !password){
      return res.status(400).json({message :"All field are required"});
     }
      if(password.length<6){
        return res.status(400).json({message :"Password length must be of 6 characters"});
      }

      const user = await User.findOne({email});
      if(user) {return res.status(400).json({message:"Email already exists"})};

        //Hashing password using bcrypt package
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password , salt);

       //If user doesn't exists create a new user with the give values
      const newUser = new User(
        {
          fullName:fullName , 
          email:email,
          password:hashedPassword
        }
      )
      if(newUser){
        //if user succesfully created --> generate AWT token
        generateToken(newUser._id , res)
        await newUser.save();

        res.status(201).json(
          {
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
          }
        );
      }
      else{
        res.status(400).json({message:"Invalid User data"})
      }

  }catch(err){
    console.log(err)
    res.status(500).json({message:"Internal error"})
  }

};
export const login = async(req, res) => {
  const {email , password} = req.body;
  try{
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"Invalid Credential"});
    }
    const isPasswordCorrect = await bcrypt.compare(password , user.password)
    if(!isPasswordCorrect){
      return res.status(400).json({message:"Invalid Credential"});
    }
    else{
        generateToken(user._id , res)
        res.status(200).json(
          {
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
          }
        )
    }
  
  }catch(err){
    console.log("Error in login controller" , err.message);
    res.status(500).json({message:"Internal server error"});
  }
};
export const logout = (req, res) => {
  try{
   res.cookie("jwt","" , {maxAge:0})
   res.status(200).json({message:"Logged Out successfully"});
  }catch(err){
      console.log("Error in logout controller",err.message);
      res.status(500).json({message:"Internal Server error"})
  }
 
} ;

export const updateProfile = async(req ,res)=>{
  try{
     const {profilePic} = req.body;
    const userId =  req.user._id;
    if(!profilePic){
      return res.status(400).json({message:"Profile pic required"});
    }
    const uploadRespose =  await cloudinary.uploader.upload(profilePic);
    const updateduser = await User.findByIdAndUpdate(userId , {profilePic:uploadRespose.secure_url},{new:true})
   
    res.status(200).json(updateduser)


  }catch(err){
    console.log("error in uploading image");
    res.status(500).json({message:"Internal Server erro"})
  }
}

export const checkAuth = async(req ,res)=>{
  try{
    res.status(200).json(req.user);
  }catch(err){
    console.log("Error in checkAuth controller" , err.message);
    res.status(500).json({message:"Internal Server Error!"});
  }
}