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
  res.status(400).send("Error");
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

