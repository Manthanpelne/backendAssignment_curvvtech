const express = require("express")
const { createSession, getMySessions, getSessionById, DeleteSession } = require("../controllers/sessionController")
const protect = require("../middlewares/authMiddleware")


const router = express.Router()

router.post("/create",protect,createSession)
router.get("/my-sessions",protect,getMySessions)
router.get("/:id",protect,getSessionById)
router.delete("/:id",protect,DeleteSession)


module.exports = router