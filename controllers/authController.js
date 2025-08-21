const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//generate jwt
const generateToken = (userId) =>{
    return jwt.sign({id:userId},process.env.jwtSecret,{expiresIn:"7d"})
}


//signup
const registerUser = async(req,res)=>{
try {
    const {name, email, password, role} = req.body
    const userExits = await User.findOne({email})
    if(userExits){
        return res.status(400).send({message:"User already exists"})
    }
    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password,salt)

    //create new user
    const user = await User.create({
        name, email, password:hashPassword, role
    })

    res.status(200).send({
        success:true,
        message:"User registered successfully",
    })
} catch (error) {
    res.status(400).send({message:"Server error", error:error.message})
}
}



//login
const loginUser = async(req,res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
        return res.status(400).send({message:"User not found. Sign up first"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).send({message:"Invalid email or password"})
        }

         res.status(200).send({
            success:true,
            token: generateToken(user._id),
        message:"Login successfull",
         "user": {
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
         }
    })

    } catch (error) {
         res.status(400).send({message:"Server error", error:error.message})
    }
}



//profile
const getUserProfile = async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password")
        if(!user){
        return res.status(400).send({message:"User not found. Sign Up first"})
        }
        res.status(200).send(user)
    } catch (error) {
         res.status(400).send({message:"Server error", error:error.message})
    }
}

module.exports = {registerUser, loginUser, getUserProfile}