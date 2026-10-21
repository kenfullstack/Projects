import express from 'express'
import { createWorker } from '../controllers/WorkerController.js'
import { protect, requireOwner } from '../middlewares/auth.js'
import asyncHandler from '../middlewares/asyncHandler.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const router = express.Router()

router.post('/', protect, requireOwner, asyncHandler(createWorker))

export default router