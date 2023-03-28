const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {type: String, required: true },
    userName: {type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    dob: String,
    gender: String,
    country: String,
    state: String,
    city: String,
    sendEmail: Boolean,
    profilePic: {type: String, default: "../pics/user_icon.png" },
    userType: {type: String, required: true, default: "user", enum: ["user", "seller", "developer", "employee"] },
    createdAt: {type: Date, required: true, default: Date.now() }
})

const User = mongoose.model("user", userSchema)

module.exports = {
    User
}