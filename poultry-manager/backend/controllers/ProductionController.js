import mongoose from 'mongoose'
import { Production } from '../models/Production.js'
import { Poultry } from '../models/Poultry.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const getOwnerId = (user) => {
  return user.role === 'Owner' ? user._id : user.owner
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const createProduction = async (req, res) => {
  const { poultry, eggCount, collectDate } = req.body

  if (!mongoose.Types.ObjectId.isValid(poultry)) {
    return res.status(400).json({
      message: 'Please select a poultry batch.'
    })
  }

  const batch = await Poultry.findOne({
    _id: poultry,
    user: getOwnerId(req.user),
    isDeleted: false
  })

  if (!batch) {
    return res.status(404).json({
      message: 'Poultry batch not found'
    })
  }

  const errors = []

  const eggCountNumber = Number(eggCount)

  if (
    eggCount === undefined ||
    eggCount === null ||
    eggCount === ''
  ) {
    errors.push('Please enter the egg count.')
  } else if (!Number.isFinite(eggCountNumber)) {
    errors.push('Please enter a valid egg count.')
  } else if (eggCountNumber < 0) {
    errors.push('Egg count cannot be negative.')
  } else if (!Number.isInteger(eggCountNumber)) {
    errors.push('Egg count must be a whole number.')
  }

  let date = null

  if (
    typeof collectDate !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(collectDate)
  ) {
    errors.push('Please select a valid egg collection date.')
  } else {
    date = new Date(`${collectDate}T00:00:00.000Z`)

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== collectDate
    ) {
      errors.push('Please select a valid egg collection date.')
    } else {
      const today = new Date()
      const todayString = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(today)

      const birthdayString = new Date(batch.birthday)
        .toISOString()
        .slice(0, 10)

      if (collectDate < birthdayString) {
        errors.push(
          'Egg collection date cannot be before the poultry birthday.'
        )
      }

      if (collectDate > todayString) {
        errors.push('Egg collection date cannot be in the future.')
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ messages: errors })
  }

  const existingRecord = await Production.findOne({
    user: getOwnerId(req.user),
    poultry: batch._id,
    collectDate: date,
    isDeleted: false
  })

  if (existingRecord) {
    return res.status(409).json({
      message: 'A production record already exists for this batch and date.'
    })
  }

  const production = await Production.create({
    user: getOwnerId(req.user),
    poultry: batch._id,
    eggCount: eggCountNumber,
    collectDate: date,
    active: batch.active
  })

  res.status(201).json(production)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const getProduction = async (req, res) => {
  const production = await Production.find({
    user: getOwnerId(req.user),
    isDeleted: false
  }).populate({
    path: 'poultry',
    select: 'batchName',
    match: {
      user: getOwnerId(req.user)
    }
  })

  res.status(200).json(production)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const getProductionById = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid production record ID format'
    })
  }

  const production = await Production.findOne({
    _id: id,
    user: getOwnerId(req.user),
    isDeleted: false
  }).populate({
    path: 'poultry',
    select: 'batchName',
    match: {
      user: req.user._id
    }
  })

  if (!production) {
    return res.status(404).json({
      message: 'Production record not found'
    })
  }

  res.status(200).json(production)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const getEggMonthly = async (req, res) => {
  const eggMonthly = await Production.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(getOwnerId(req.user)),
        isDeleted: false
      }
    },

    {
      $group: {
        _id: {
          poultry: '$poultry',
          year: { $year: '$collectDate' },
          month: { $month: '$collectDate' }
        },
        totalEggs: { $sum: '$eggCount' },
        totalActiveHenDays: { $sum: '$active' }
      }
    },

    {
      $project: {
        _id: 0,
        poultry: '$_id.poultry',
        year: '$_id.year',
        month: '$_id.month',
        totalEggs: 1,
        totalActiveHenDays: 1,
        eggMonthlyEfficiency: {
          $cond: [
            { $gt: ['$totalActiveHenDays', 0] },
            {
              $multiply: [
                {
                  $divide: [
                    '$totalEggs',
                    '$totalActiveHenDays'
                  ]
                },
                100
              ]
            },
            0
          ]
        }
      }
    },

    {
      $lookup: {
        from: 'poultries',
        let: { poultryId: '$poultry' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$poultryId'] },
                  { $eq: ['$user', new mongoose.Types.ObjectId(getOwnerId(req.user))] }
                ]
              }
            }
          },

          {
            $project: {
              batchName: 1
            }
          }
        ],

        as: 'poultry'
      }
    },

    {
      $unwind: {
        path: '$poultry',
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $project: {
        poultry: {
          $ifNull: ['$poultry.batchName', 'Unknown batch']
        },
        year: 1,
        month: 1,
        totalEggs: 1,
        totalActiveHenDays: 1,
        eggMonthlyEfficiency: 1
      }
    },

    {
      $sort: {
        year: -1,
        month: -1,
        poultry: 1
      }
    }
  ])

  res.status(200).json(eggMonthly)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const updateProduction = async (req, res) => {
  const { poultry, eggCount, collectDate } = req.body
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid production record ID format'
    })
  }

  const production = await Production.findOne({
    _id: id,
    user: getOwnerId(req.user),
    isDeleted: false
  })

  if (!production) {
    return res.status(404).json({
      message: 'Production record not found'
    })
  }

  if (!mongoose.Types.ObjectId.isValid(poultry)) {
    return res.status(400).json({
      message: 'Please select a poultry batch.'
    })
  }

  const batch = await Poultry.findOne({
    _id: poultry,
    user: getOwnerId(req.user),
    isDeleted: false
  })

  if (!batch) {
    return res.status(404).json({
      message: 'Poultry batch not found'
    })
  }


  const errors = []

  const eggCountNumber = Number(eggCount)

  if (
    eggCount === undefined ||
    eggCount === null ||
    eggCount === ''
  ) {
    errors.push('Please enter the egg count.')
  } else if (!Number.isFinite(eggCountNumber)) {
    errors.push('Please enter a valid egg count.')
  } else if (eggCountNumber < 0) {
    errors.push('Egg count cannot be negative.')
  } else if (!Number.isInteger(eggCountNumber)) {
    errors.push('Egg count must be a whole number.')
  }

  let date = null

  if (
    typeof collectDate !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(collectDate)
  ) {
    errors.push('Please select a valid egg collection date.')
  } else {
    date = new Date(`${collectDate}T00:00:00.000Z`)

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== collectDate
    ) {
      errors.push('Please select a valid egg collection date.')
    } else {
      const today = new Date()
      const todayString = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(today)

      const birthdayString = new Date(batch.birthday)
        .toISOString()
        .slice(0, 10)

      if (collectDate < birthdayString) {
        errors.push(
          'Egg collection date cannot be before the poultry birthday.'
        )
      }

      if (collectDate > todayString) {
        errors.push('Egg collection date cannot be in the future.')
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ messages: errors })
  }

  const existingRecord = await Production.findOne({
    user: req.user._id,
    poultry: batch._id,
    collectDate: date,
    isDeleted: false,
    _id: { $ne: id }
  })

  if (existingRecord) {
    return res.status(409).json({
      message: 'A production record already exists for this batch and date.'
    })
  }

  production.poultry = batch._id
  production.eggCount = eggCountNumber
  production.collectDate = date
  production.active = batch.active

  await production.save()

  res.status(200).json(production)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const deleteProduction = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid production record ID format'
    })
  }

  const production = await Production.findOneAndUpdate(
    {
      _id: id,
      user: getOwnerId(req.user),
      isDeleted: false
    },
    {
      isDeleted: true
    },
    {
      returnDocument: 'after'
    }
  )

  if (!production) {
    return res.status(404).json({
      message: 'Production record not found'
    })
  }

  res.status(200).json({
    message: 'Production record deleted successfully'
  })
}