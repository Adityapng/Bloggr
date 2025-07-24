const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const connectDB = require("./config/connection")

const app = express()
dotenv.config()
const PORT = process.env.PORT || 3030
connectDB()

app.use(express.json())

app.get("/", (req, res)=>{
    res.end('Hello World')
})

app.listen(PORT, ()=>{ console.log(`Server started at Port ${PORT}`);
})