const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const {createClient} = require("redis")
require("dotenv").config();


const client = createClient({
    url: process.env.redis
});

client.on('error', err => console.log('Redis Client Error', err));


// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();


const {User} = require("../models/user.model")

const userRouter = express.Router();

userRouter.get("/", async(req,res)=>{
    try{
        const users = await User.find();
        res.status(200).send({message: users})
    }
    catch(err){
        console.log(err)
        res.status(500).send({message: "Something went wrong", err})
    }
})

userRouter.post("/login", async(req,res)=>{
    try{
        const userDetail = req.body;
        const user = await User.find(userDetail.email || userDetail.userName)
        if (user.length>0){
            bcrypt.compare(userDetail.password, user.password, async (err,result)=>{
                if (result){
                    const token = jwt.sign({userID: user[0]._id}, process.env.secretKey, {
                        expiresIn: 43200
                    })
                    const refreshToken = jwt.sign({userID: user[0]._id}, process.env.refreshSecret, {
                        expiresIn: 86400
                    })
                    res.cookie("token", token)
                    res.cookie("refreshToken", refreshToken)
                    res.status(200).send({message: "Login Success"})
                }
                else {
                    res.status(401).send({message: "Wrong Password", err})
                }
            })
        }
        else {
            res.status(401).send({message: "Please Register Your Self"})
        }
    }
    catch(err){
        console.log("Catch block")
        res.status(500).send({message: "Something went wrong", err})
    }
})

userRouter.post("/register", async(req,res)=>{
    try{
        const userDetail = req.body;
        const existingCheckEmail = await User.find(userDetail.email)
        const existingCheckUserName = await User.find(userDetail.userName)
        if (existingCheckEmail.length > 0){
            res.status(403).send({message: "User already exist With this email"})
        }
        else if (existingCheckUserName > 0){
            res.status(403).send({message: "User already exist With this user name"})
        }
        else {
            bcrypt.hash(userDetail.password, 4, async(err, hash)=>{
                if (err) {
                    console.log("Error while Hashing")
                    res.status(500).send({message: "Unable to hash the password"})
                }
                else {
                    userDetail.password = hash
                    const adding = new User(userDetail)
                    await adding.save()
                    res.status(200).send({message: "Register Success"})
                }
            })
        }
    }
    catch(err){
        console.log("Catch block")
        res.status(500).send({message: "Something went Wrong", err})
    }
})

userRouter.get("/refreshToken", async(req,res)=>{
    try{
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken){
            jwt.verify(refreshToken, process.env.refreshSecret, async(err, decoded)=>{
                if (err){
                    console.log("Refresh verify Error -> "+err)
                    res.status(403).send({message: "Please Login"})
                }
                else{
                    const token = jwt.sign({userID: decoded.userID}, process.env.secretKey, {
                        expiresIn: 43200
                    })
                    res.cookie("token", token)
                    res.status(200).send({message: "Token Generated from RefreshToken"})
                }
            })
        }
        else{
            res.status(403).send({message: "Please Login"})
        }
    }
    catch(err){
        console.log("Catch block")
        res.status(500).send({message: "Something went Wrong", err})
    }
})

userRouter.get("/logout", async(req,res)=>{
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    await client.sAdd("blacklist", `${token} ${refreshToken}`,{
        EX: 86400
    })
    res.status(200).send({message: "Logout Successful"})
})


module.exports = {
    userRouter,client
}