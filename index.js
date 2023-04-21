const express = require("express");
require("dotenv").config()
const cors = require("cors")

const {connection} = require("./config/db");
const {userRouter, client} = require("./routes/user.route")
const {logger} = require("./config/logger");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(cookieParser())

app.use("/user", userRouter)


app.get("/", (req,res)=>{
    res.status(200).send({msg: "Backend App Home Page"})
})


app.listen(process.env.port, async()=>{
    try{
        await connection;
        await client.connect();
        console.log("connected To DB")
    }catch(err){
        console.log("App listening Catch block")
    }
    console.log("Server is at "+ process.env.port)
})