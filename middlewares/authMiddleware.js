const jwt = require("jsonwebtoken")
const User = require("../models/User")


const protect = async(req,res,next)=>{
    try {
        let token = req.headers.authorization
        if(token){
            const decoded = jwt.verify(token, process.env.jwtSecret)
            req.user = await User.findById(decoded.id).select("-password")
            next()
        }else{
            res.status(400).send({message:"Login first"})
        }
    } catch (error) {
         res.status(400).send({message:"Login first", error:error.message})
    }
}

module.exports = protect