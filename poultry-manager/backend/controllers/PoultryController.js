import { Poultry } from '../models/Poultry.js'
import cloudinary from '../config/cloudinary.js'
import { Production } from '../models/Production.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const getOwnerId = (user) => {
  return user.role === 'Owner' ? user._id : user.owner
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const uploadImage = async (file) => {
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'poultry-manager'
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(file.buffer)
  })

  return result.secure_url
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const createPoultry = async (req, res) => {
  const {
    batchName,
    breed,
    birthday,
    cullingAge,
    total,
    active
  } = req.body

  const poultry = new Poultry({
    user: getOwnerId(req.user),
    batchName,
    breed,
    birthday,
    cullingAge,
    total,
    active
  })

  const errors = []

  try {
    await poultry.validate()
  } catch (error) {
    if (error.name === 'ValidationError') {
      errors.push(
        ...Object.values(error.errors).map(
          (validationError) => validationError.message
        )
      )
    } else {
      throw error
    }
  }

  if (batchName) {
    const existingPoultry = await Poultry.findOne({
      user: getOwnerId(req.user),
      batchName: batchName.trim(),
      isDeleted: false
    })

    if (existingPoultry) {
      errors.push('A batch with this name already exists.')
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      messages: errors
    })
  }

  let imageUrl = null

  if (req.file) {
    imageUrl = await uploadImage(req.file)
  }

  poultry.image = imageUrl

  await poultry.save()

  res.status(201).json(poultry)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const updatePoultry = async (req, res) => {
  const {
    batchName,
    breed,
    birthday,
    cullingAge,
    total,
    active
  } = req.body

  const poultry = await Poultry.findOne({
    _id: req.params.id,
    user: getOwnerId(req.user),
    isDeleted: false
  })

  if (!poultry) {
    return res.status(404).json({
      message: 'Poultry batch not found'
    })
  }

  let imageUrl = poultry.image

  if (req.file) {
    imageUrl = await uploadImage(req.file)
  }

  poultry.batchName = batchName
  poultry.breed = breed
  poultry.birthday = birthday
  poultry.cullingAge = cullingAge
  poultry.total = total
  poultry.active = active
  poultry.image = imageUrl

  await poultry.save()

  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Manila'
  })

  const startOfToday = new Date(`${today}T00:00:00.000Z`)

  const startOfTomorrow = new Date(startOfToday)
  startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1)

  await Production.updateMany(
    {
      user: getOwnerId(req.user),
      poultry: poultry._id,
      collectDate: {
        $gte: startOfToday,
        $lt: startOfTomorrow
      }
    },
    {
      $set: {
        active: poultry.active
      }
    }
  )

  res.status(200).json(poultry)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const getPoultry = async (req, res) => {
  const poultry = await Poultry.find({
    user: getOwnerId(req.user),
    isDeleted: false
  })

  res.status(200).json(poultry)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const getPoultryById = async (req, res) => {
  const poultry = await Poultry.findOne({
    _id: req.params.id,
    user: getOwnerId(req.user),
    isDeleted: false
  })

  if (!poultry) {
    return res.status(404).json({
      message: 'Poultry batch not found'
    })
  }

  res.status(200).json(poultry)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const deletePoultry = async (req, res) => {
  const poultry = await Poultry.findOneAndUpdate(
    {
      _id: req.params.id,
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

  if (!poultry) {
    return res.status(404).json({
      message: 'Poultry batch not found'
    })
  }

  res.status(200).json({
    message: 'Poultry batch deleted successfully'
  })
}