const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);

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

