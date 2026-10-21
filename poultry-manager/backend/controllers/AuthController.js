import { User } from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const registerUser = async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      email,
      password
    } = req.body

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      lastName,
      firstName,
      email,
      password: hashedPassword,
      role: 'Owner'
    })

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({
      message: 'Failed to register user',
      error: error.message
    })
  }
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false
    })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({
      message: 'Failed to log in',
      error: error.message
    })
  }
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const getMe = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role
    }
  })
}