import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required'
    })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({
      _id: decoded.userId,
      isDeleted: false
    }).select('-password')

    if (!user) {
      return res.status(401).json({
        message: 'User not found or account is inactive'
      })
    }

    req.user = user

    next()
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        message: 'Invalid or expired token'
      })
    }

    next(error)
  }
}

export const requireOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'Owner') {
    return res.status(403).json({
      message: 'Owner access required'
    })
  }

  next()
}