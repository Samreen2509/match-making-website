const express = require("express");

const app = express();

app.use((req,res) =>{
    res.send("Hello server created.");
});
app.use("/test",(req,res) =>{
    res.send("Hello server test");
});

app.listen(3000, () => {
    console.log("Server is sucessfully running on port 3000");
});