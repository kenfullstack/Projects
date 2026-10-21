import { User } from '../models/User.js'
import bcrypt from 'bcryptjs'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const createWorker = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await User.findOne({
      email: normalizedEmail
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const worker = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'Worker',
      owner: req.user._id
    })

    res.status(201).json({
      message: 'Worker account created successfully',
      user: {
        id: worker._id,
        firstName: worker.firstName,
        lastName: worker.lastName,
        email: worker.email,
        role: worker.role
      }
    })
  } catch (error) {
    console.error('Failed to create Worker:', error.message)

    res.status(500).json({
      message: 'Failed to create Worker account'
    })
  }
}