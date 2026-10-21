import { Finance } from '../models/Finance.js'
import mongoose from 'mongoose'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const createFinance = async (req, res) => {
  const {
    transactionType,
    paymentStatus,
    category,
    magnitude,
    amount,
    quantity,
    description,
    deliveryDate,
    paymentDate
  } = req.body

  const finance = await Finance.create({
    user: req.user._id,
    transactionType,
    paymentStatus,
    category,
    magnitude,
    amount,
    quantity,
    description,
    deliveryDate,
    paymentDate,
  })

  res.status(201).json(finance)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const getFinance = async (req, res) => {
  const finance = await Finance.find({
    user: req.user._id,
    isDeleted: false
  })

  res.status(200).json(finance)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const getMonthlyFinance = async (req, res) => {
  const monthlyFinance = await Finance.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
        isDeleted: false,
        paymentStatus: 'paid',
        paymentDate: { $ne: null }
      }
    },

    {
      $group: {
        _id: {
          year: { $year: '$paymentDate' },
          month: { $month: '$paymentDate' }
        },

        income: {
          $sum: {
            $cond: [
              { $eq: ['$transactionType', 'income'] },
              '$calculatedTotal',
              0
            ]
          }
        },

        expense: {
          $sum: {
            $cond: [
              { $eq: ['$transactionType', 'expense'] },
              '$calculatedTotal',
              0
            ]
          }
        }
      }
    },

    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        income: 1,
        expense: 1,
        netProfit: {
          $subtract: ['$income', '$expense']
        }
      }
    },

    {
      $sort: {
        year: -1,
        month: -1
      }
    }
  ])

  res.status(200).json(monthlyFinance)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const getFinanceById = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid finance record ID format'
    })
  }

  const finance = await Finance.findOne({
    _id: id,
    user: req.user._id,
    isDeleted: false
  })

  if (!finance) {
    return res.status(404).json({
      message: 'Finance record not found'
    })
  }

  res.status(200).json(finance)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const updateFinance = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid finance record ID format'
    })
  }

  const {
    transactionType,
    paymentStatus,
    category,
    magnitude,
    amount,
    quantity,
    description,
    deliveryDate,
    paymentDate
  } = req.body

  const finance = await Finance.findOne({
    _id: id,
    user: req.user._id,
    isDeleted: false
  })

  if (!finance) {
    return res.status(404).json({
      message: 'Finance record not found'
    })
  }

  finance.transactionType = transactionType
  finance.paymentStatus = paymentStatus
  finance.category = category
  finance.magnitude = magnitude
  finance.amount = amount
  finance.quantity = quantity
  finance.description = description
  finance.deliveryDate = deliveryDate
  finance.paymentDate = paymentDate

  await finance.save()

  res.status(200).json(finance)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const deleteFinance = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid finance record ID format'
    })
  }

  const finance = await Finance.findOneAndUpdate(
    {
      _id: id,
      user: req.user._id,
      isDeleted: false
    },
    {
      isDeleted: true
    },
    {
      returnDocument: 'after'
    }
  )

  if (!finance) {
    return res.status(404).json({
      message: 'Finance record not found'
    })
  }

  res.status(200).json({
    message: 'Finance record deleted successfully'
  })
}