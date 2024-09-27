const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config({ path: "./.env" })
const path = require("path")
const { adminProtected } = require("./middlewares/protected")

const app = express()

//middleware
app.use(express.json())
app.use(express.static("dist"))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",

    credentials: true
}))
app.use("/api/admin", adminProtected, require('./routes/admin.routes'))
app.use("/api/auth", require('./routes/auth.routes'))
app.use("/api/public", require('./routes/public.routes'))


app.use("*", (req, res) => {
    // res.status(404).json({ message: "Resource Not Found" })
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: `server error${err.message} ` })
})
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("MONGOOSE CONNECTED")
    app.listen(process.env.PORT, console.log("Server Runnning`"))
})