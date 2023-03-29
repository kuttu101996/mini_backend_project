const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const {client} = require("../routes/user.route")
require("dotenv").config();

const authentication = async(req,res,next)=>{
    try{
        const userID = req.cookies.userID;
        const token = req.cookies.token;
        
    }
    catch(err){
        console.log("Authentication Catch block")
        res.status(500).send({message: "Something went wrong", err})
    }
}