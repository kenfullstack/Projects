import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import connectDB from '../connectDB.js'
import { User } from '../models/User.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
dotenv.config()

const createInitialOwner = async () => {
  try {
    const {
      INITIAL_OWNER_FIRST_NAME,
      INITIAL_OWNER_LAST_NAME,
      INITIAL_OWNER_EMAIL,
      INITIAL_OWNER_PASSWORD
    } = process.env

    if (
      !INITIAL_OWNER_FIRST_NAME ||
      !INITIAL_OWNER_LAST_NAME ||
      !INITIAL_OWNER_EMAIL ||
      !INITIAL_OWNER_PASSWORD
    ) {
      throw new Error('Missing initial Owner credentials in .env')
    }

    await connectDB()

    const existingOwner = await User.findOne({
      role: 'Owner'
    })

    if (existingOwner) {
      throw new Error('An Owner account already exists')
    }

    const email = INITIAL_OWNER_EMAIL.trim().toLowerCase()
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new Error('This email is already registered')
    }

    const hashedPassword = await bcrypt.hash(
      INITIAL_OWNER_PASSWORD,
      10
    )

    const owner = await User.create({
      firstName: INITIAL_OWNER_FIRST_NAME,
      lastName: INITIAL_OWNER_LAST_NAME,
      email,
      password: hashedPassword,
      role: 'Owner'
    })

    console.log(`Initial Owner created: ${owner.email}`)

  } catch (error) {
    console.error('Failed to create initial Owner:', error.message)
    process.exitCode = 1

  } finally {
    await mongoose.disconnect()
  }
}

await createInitialOwner()