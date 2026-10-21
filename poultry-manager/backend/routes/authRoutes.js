import express from 'express'
import { loginUser, getMe } from '../controllers/AuthController.js'
import { protect } from '../middlewares/auth.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const router = express.Router()

router.post('/login', loginUser)
router.get('/me', protect, getMe)

export default router