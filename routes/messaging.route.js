const app = require("../index")
const {Server} = require("socket.io")
const http = require("http")


const httpServer = http.createServer(app)

const io = new Server(httpServer)

io.on("connection", (socket)=>{
    console.log("new client Connected")
    socket.on("join", (msg)=>{
        console.log(msg)
        socket.emit("joined", "Hello from server")
        // socket.broadcast.emit("joined", "Hello from server")
        socket.on("disconnect", ()=>{
            socket.broadcast.emit("left", name)
        })
    })

    socket.on("msg", (data)=>{
        socket.broadcast.emit("text", data)
    })
})


module.exports = {httpServer}