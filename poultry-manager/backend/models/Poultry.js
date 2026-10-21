import mongoose from 'mongoose'

const poultrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    image: {
      type: String
    },

    batchName: {
      type: String,
      required: true,
      trim: true
    },

    breed: {
      type: String,
      required: true,
      trim: true
    },

    birthday: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const birthday = new Date(value)
          birthday.setHours(0, 0, 0, 0)

          return birthday <= today
        },
        message: 'Birthday cannot be later than today.'
      }
    },

    cullingAge: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Culling age must be a whole number.'
      }
    },

    total: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Total poultry must be a whole number.'
      }
    },

    active: {
      type: Number,
      required: true,
      min: 0,
      validate: [
        {
          validator: Number.isInteger,
          message: 'Active poultry must be a whole number.'
        },
        {
          validator: function (value) {
            return value <= this.total
          },
          message: 'Active poultry cannot exceed total poultry.'
        }
      ]
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },

  {
    timestamps: true
  }
)

poultrySchema.index(
  { user: 1, batchName: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false }
  }
)

export const Poultry = mongoose.model('Poultry', poultrySchema)