import express from 'express'
import {
  createProduction,
  getProduction,
  getEggMonthly,
  deleteProduction,
  updateProduction,
  getProductionById
} from '../controllers/ProductionController.js'
import { protect } from '../middlewares/auth.js'
import asyncHandler from '../middlewares/asyncHandler.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const router = express.Router()

router.post('/', protect, asyncHandler(createProduction))
router.get('/', protect, asyncHandler(getProduction))
router.get('/monthly', protect, asyncHandler(getEggMonthly))
router.get('/:id', protect, asyncHandler(getProductionById))
router.delete('/:id', protect, asyncHandler(deleteProduction))
router.put('/:id', protect, asyncHandler(updateProduction))

export default router