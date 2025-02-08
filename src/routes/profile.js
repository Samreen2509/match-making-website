const express = require('express');
const userAuth = require("../middlewares/auth");
const validateEditRequest = require("../utils/validation");

const profileRouter = express.Router();
//profile api
profileRouter.get("/profile/view",userAuth, async(req,res) => {
    try{
      const user = req.user;
      
      res.send(user);
    }catch(err){
         res.status(400).send("Error" + err.message); 
       }
   });

   //profile updation api
   profileRouter.patch("/profile/edit", userAuth, async(req,res) =>{
    try{
        if(!validateEditRequest)
        {
            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        res.send("Edit Succesful...");

    }catch(err){
         res.status(400).send("Error" + err.message); 
       }
     
   });

module.exports = profileRouter;