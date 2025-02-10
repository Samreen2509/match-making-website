const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
            minLength : 2,
            
        },
        lastName : {
            type : String,
            minLength : 2,
            maxLength : 30,
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email address : "+ value);
                }
            }
        },
        password : {
            type : String,
            required : true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Password is weak : " + value);
                }
            }
        },
        age : {
            type : Number,
            min : 18,
        },
        gender : {
            type : String,
            validate(value) {
             if(!["male","female","other"].includes(value)){
                throw new Error("Gender is not valid");
             }
            },
        },
        photoId : {
            type : String,
            default : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-collection-1290556063",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid url address : "+ value);
                }
            }
        },
        desc : {
            type : String,
            minLength : 1,
            maxLength : 300,
        },
        about : {
            type : String,
            default : "This is a default of user!",
            minLength : 1,
            maxLength : 200,
        },
        skill : {
            type : [String],
        },
    },{
        timestamps : true,
    }
);
//creating index
userSchema.index({firstName : 1, lastName : 1});
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id : user._id}, "matchMaking",{expiresIn : "7d",});
return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const hashPassword = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,hashPassword);
return isPasswordValid;
};
module.exports = mongoose.model("User",userSchema);