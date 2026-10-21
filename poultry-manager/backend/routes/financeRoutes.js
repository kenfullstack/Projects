import express from 'express'
import {
  createFinance,
  getFinance,
  getFinanceById,
  getMonthlyFinance,
  deleteFinance,
  updateFinance
} from '../controllers/FinanceController.js'
import { protect, requireOwner } from '../middlewares/auth.js'
import asyncHandler from '../middlewares/asyncHandler.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const router = express.Router()

router.post('/', protect, requireOwner, asyncHandler(createFinance))
router.get('/', protect, requireOwner, asyncHandler(getFinance))
router.get('/monthly', protect, requireOwner, asyncHandler(getMonthlyFinance))
router.get('/:id', protect, requireOwner, asyncHandler(getFinanceById))
router.put('/:id', protect, requireOwner, asyncHandler(updateFinance))
router.delete('/:id', protect, requireOwner, asyncHandler(deleteFinance))

export default router