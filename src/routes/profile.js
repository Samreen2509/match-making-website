const express = require('express');
const userAuth = require("../middlewares/auth")

const profileRouter = express.Router();
//profile api
profileRouter.get("/profile",userAuth, async(req,res) => {
    try{
      const user = req.user;
      
      res.send(user);
    }catch(err){
         res.status(400).send("Error" + err.message);
       }
   });

   //profile updation api
   profileRouter.patch("/profile/edit", userAuth, async(req,res) =>{
     
   });

module.exports = profileRouter;