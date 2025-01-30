const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async(req,res) => {
const user = new User(req.body);
try{
  await user.save();
res.send("User added successfully...");
}catch(err){
  res.status(400).send("Some required field are missing");
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
    res.status(400).send("Error");
  }
  });

  //feed Api - Get/feed - get all the users from the databse
  app.get("/feed",async(req,res) => {
    try{
      const user = await User.find({});
      res.send(user)
    }catch(err){
      res.status(400).send("Error");
    }
  });

  //Delete api
  app.delete("/user", async(req,res) => {
     const userId = req.body._id;
     try{
      const user = await User.findByIdAndDelete({ _id : userId });
      res.send("User deleted successfully");
     }catch(err){
      res.status(400).send("Error");
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
      res.status(400).send("Update failed");
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

