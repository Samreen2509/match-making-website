const express = require('express');
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

//signup api
authRouter.post("/signup", async(req,res) => {
    const {firstName, lastName, email,password} = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password,10);
    
  const user = new User({firstName, lastName, email,password : passwordHash});
  try{
    await user.save();
    res.send("User added successfully...");
  }catch(err){
    res.status(400).send("Some required field are missing" + err.message);
  }
  });
  
  //login api 
  authRouter.post("/login", async(req,res) =>{
    try{
      const {password,email} = req.body;
  
      const user = await User.findOne({email : email});
      if(!user){
        throw new Error("Invalid credentials.") //unauthorized user
      }
      const isPasswordValid = await user.validatePassword(password);
      if(isPasswordValid)
      {
        //create jwt token , it will expire in 1 day
        const token = await user.getJWT();
  
        //add token to the cookie and send the response back to the user
        res.cookie("token",token, {expires : new Date(Date.now() + 8*3600000), });
        res.send(user);
      }
      else {
        res.send("Invalid credential");
      }
  
    }catch(err){
    res.status(400).send("ERROR : " + err.message);
  }
  });

  //logout api
  authRouter.post("/logout", async(req,res) =>{
    res.cookie("token",null, {expires : new Date(Date.now()), }).send("User logout successfully");
  });

module.exports = authRouter;