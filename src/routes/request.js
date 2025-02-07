const express = require('express');
const userAuth = require("../middlewares/auth")
const requestRouter = express.Router();
//sendConnectionRequest api
requestRouter.post("/sendConnectRequest", userAuth, async(req, res) =>{
    const user = req.user;
   
    res.send(user.firstName + " Sent the connection request.");
   });

module.exports = requestRouter;