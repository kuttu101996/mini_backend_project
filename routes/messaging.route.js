const app = require("../index")
const {Server} = require("socket.io")
const http = require("http")


const httpServer = http.createServer(app)

const io = new Server(httpServer)

io.on("connection", (socket)=>{
    console.log("new client Connected")
    socket.on("join", (name)=>{
        console.log(name)
        socket.broadcast.emit("joined", name)
        socket.on("disconnect", ()=>{
            socket.broadcast.emit("left", name)
        })
    })

    socket.on("msg", (data)=>{
        socket.broadcast.emit("text", data)
    })
})


module.exports = {httpServer}