const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://dating:dating123@cluster0.9kyi3.mongodb.net/datingWeb"
    );
};

module.exports = connectDB;
