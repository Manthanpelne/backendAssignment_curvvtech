const express = require("express")
const protect = require("../middlewares/authMiddleware")
const { addQuestionsToSession, togglePinQuestion, updateQuestionNote } = require("../controllers/questionController")

const router = express.Router()


router.post("/add",protect,addQuestionsToSession)
router.post("/:id/pin",protect, togglePinQuestion)
router.post("/:id/note",protect, updateQuestionNote)

module.exports = router;