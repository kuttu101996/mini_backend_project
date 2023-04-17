const jwt = require("jsonwebtoken")
// const cookieParser = require("cookie-parser")
const {client} = require("../routes/user.route")
require("dotenv").config();

const authentication = async(req,res,next)=>{
    try{
        // const userID = req.cookies.userID;
        // const token = req.cookies.token;
        let token = req.headers.authorization.split(' ')[1]
        if (!token){
            return res.status(400).send({message: "Please Login"})
        }
        jwt.verify(token, process.env.secretKey, (err, decoded)=>{
            if (err){
                return res.status.send({message: err})
            }
            req.body.userID = decoded.userID;
            next()
        })
    }
    catch(err){
        console.log("Authentication Catch block")
        res.status(500).send({message: "Something went wrong", err})
    }
}


module.exports = {
    authentication
}