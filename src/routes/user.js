const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

//get all the pending connection request of the loggedin user
userRouter.get('/user/request/received', userAuth, async(req,res) =>{
   try{
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
        toUserId : loggedInUser._id,
        status : "interested",
    }).populate("fromUserId",["firstName","lastName"]);

    res.json({message: "Data fetch successfully",
        data : connectionRequest,
    });
   }catch(err){
    res.status(400).send("Error : " + err.message);
   }


});

//fetch all the user connection
userRouter.get('/user/connection' ,userAuth, async(req,res) =>{
  try{
    const loggedInUser = req.user;

  const totalConnection= await ConnectionRequest.find({
  toUserId : loggedInUser,
  status : "accepted",
  }).populate("fromUserId",["firstName","lastName","email","skill","gender","photoUrl","age"]);
  res.json({message : "List of your all connection.",
    data : totalConnection,
  })
}catch(err){
    res.status(400).send("Error : "+ err.message);
}
});

//Feed api
//user will not see the cards in the feed
// 1 his own card
// 2 his connection request
// 3 his rejected connection
// 4 already send the connection request
userRouter.get('/user/feed', userAuth, async(req, res) =>{
    try{
        const logedInUser = req.user;
        const {status} = req.params
        const allowedUser = ["accepted","requested"];

        if(!allowedUser.includes(status)){

        }


    }catch(err){
        res.status(400).send("Error : " +err.message);
    }
});
  

module.exports = userRouter;