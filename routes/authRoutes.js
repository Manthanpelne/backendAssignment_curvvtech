const express = require("express")
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController")
const protect = require("../middlewares/authMiddleware")
const upload = require("../middlewares/uploadMiddleware")


const router = express.Router()

//Auth Routes
router.post("/sign-up",registerUser)
router.post("/login",loginUser)
router.get("/profile",protect,getUserProfile)


router.post("/upload-image", upload.single("image"),(req,res)=>{
    try {
          if(!req.file){
        return res.status(400).send({message:"No file uploaded"})
    }
    const imgUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    res.status(200).send({imgUrl})
    } catch (error) {
         res.status(400).send({message:"Server error", error:error.message})
    }
})

module.exports = router