const express = require("express");
const userAuth = require("../middlewares/auth")
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");
//sendConnectionRequest api
requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) =>{
  try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId; 
    const status = req.params.status;

    const allowedStatus = ["interested","ignored"];

    if(!allowedStatus.includes(status))
    {
        return res.status(400).json({message : "Invalid status type :" + status} );
    }
    //connection request is existing
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:
        [{fromUserId,toUserId},
            {fromUserId: toUserId, toUserId: fromUserId},
        ],
    });
   // Check Whether user exit in the db or not
  const toUser = await User.findById(toUserId);
  if(!toUser){
        return res.status(404).json({
          message : "User not found!",
        });
  }
    if(existingConnectionRequest){
        return res.status(400).json({message : "Request is already exit!!! :" + status} );
    }
    const requestData = new ConnectionRequest({fromUserId,toUserId,status,});
    const data = await requestData.save();
    res.json({
      message : req.user.firstName + " " + status + " " + toUser.firstName,
      data,
  });
  }catch(err){
    res.status(400).send("Error : " + err.message);
  }
});
module.exports = requestRouter;