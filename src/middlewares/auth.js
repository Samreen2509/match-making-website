const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {

    //Read the token from the req cookies
    const {token} = req.cookies;
    try{
        if(!token)
            {
                return res.status(401).send("Please login!")
            }
            //Validate the token
            const decodesObj = await jwt.verify(token, "matchMaking");
            //Extract id from the decoded object
            const { _id } = decodesObj;
            const user = await User.findById(_id);
        
            if(!user)
            {
                throw new Error("User not found.");
            }
            //whosoever found from the database attach to the user
             req.user = user;
            //next is called to move to the request handler
            next();
           
    }catch(err){
        res.status(400).send("Error" + err.message);
      }
};

module.exports = userAuth;