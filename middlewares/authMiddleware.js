const jwt = require("jsonwebtoken")
const User = require("../models/User")


const protect = async(req,res,next)=>{
    try {
       if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
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