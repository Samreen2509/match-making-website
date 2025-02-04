const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

//signup api
app.post("/signup", async(req,res) => {
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
app.post("/login", async(req,res) =>{
  try{
    const {password,email} = req.body;

    const user = await User.findOne({email : email});
    if(!user){
      throw new Error("Invalid credential");
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(isPasswordValid)
    {
      //create jwt token
      const token = await jwt.sign({_id : user._id}, "matchMaking");

      //add token to the cookie and send the response back to the user
      res.cookie("token",token);
      res.send("User login successfully");
    }
    else {
      res.send("Invalid credential");
    }

  }catch(err){
  res.status(400).send("ERROR : " + err.message);
}
});

//profile api
app.get("/profile", async(req,res) => {
 try{
  //reading cookies
   const cookies = req.cookies;
   //extract the token from cookie
   const {token} = cookies;
   if(!token){
    throw new Error("Invalid token");
   }
   //validate the token
   const decodedMessage = await jwt.verify(token, "matchMaking");
   //get id from the decoded message
   const {_id} = decodedMessage;
   const user = await User.findById(_id);
   if(!user){
    throw new Error("User is not valid");
   }
   res.send(user);
 }catch(err){
      res.status(400).send("Error" + err.message);
    }
});

//feed Api
app.get("/user", async(req,res) => {
  const emailid = req.body.email;
  try{
    const user = await User.find({email : emailid});  
    if(user.length===0)
    {
      res.send("User not found");
    }
    res.send(user);
  }catch(err){
    res.status(400).send("Error" + err.message);
  }
  });

//feed Api - Get/feed - get all the users from the databse
app.get("/feed",async(req,res) => {
    try{
      const user = await User.find({});
      res.send(user)
    }catch(err){
      res.status(400).send("Error" + err.message);
    }
  });

//Delete api
app.delete("/user", async(req,res) => {
     const userId = req.body._id;
     try{
      const user = await User.findByIdAndDelete({ _id : userId });
      res.send("User deleted successfully");
     }catch(err){
      res.status(400).send("Error" + err.message);
    }
  });

//Update api /update date of the user
app.patch("/user", async(req,res) => {
  const userId = req.body._id;
  const data = req.body;
  try{
    const ALLOWED_UPDATES = ["userId","skill","age","gender","about"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
      throw new Error("Update not allowed");
    }
    await User.findByIdAndUpdate({_id : userId}, data,{ runValidators : true,});
    res.send("User updated successfully");
    }catch(err){
      res.status(400).send("Update failed" + err.message);
    }
});

connectDB()
  .then(() => {
    console.log("Database connection establish...");
    app.listen(3000, () => {
        console.log("Server is sucessfully running on port 3000");
    });
  })
  .catch((err) =>{
    console.error("Database can not connect...");
  });

