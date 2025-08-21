const express = require("express")
const app = express()
require("dotenv").config()
const path = require("path")
const cors = require("cors")
const connection = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const protect = require("./middlewares/authMiddleware")


//middlewares
app.use(express.json())
app.use(cors())




app.get("/api-endpoint",(req,res)=>{
    res.send("api is working fine")
})



//routes
app.use("/api/auth",authRoutes)



app.listen(process.env.port,async()=>{
    connection()
    console.log(`server running on port:${process.env.port}`)
})