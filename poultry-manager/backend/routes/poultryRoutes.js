
import express from 'express'
import {
  createPoultry,
  updatePoultry,
  getPoultry,
  getPoultryById,
  deletePoultry
} from '../controllers/PoultryController.js'
import { upload } from '../middlewares/upload.js'
import { protect } from '../middlewares/auth.js'
import asyncHandler from '../middlewares/asyncHandler.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const router = express.Router()

router.post('/', protect, upload.single('image'), asyncHandler(createPoultry))
router.put('/:id', protect, upload.single('image'), asyncHandler(updatePoultry))
router.get('/', protect, asyncHandler(getPoultry))
router.get('/:id', protect, asyncHandler(getPoultryById))
router.delete('/:id', protect, asyncHandler(deletePoultry))

export default router
