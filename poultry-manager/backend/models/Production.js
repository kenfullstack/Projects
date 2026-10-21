import mongoose from 'mongoose'

const productionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    poultry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poultry',
      required: true
    },

    eggCount: {
      type: Number,
      required: [true, 'Please enter the egg count.'],
      min: [0, 'Egg count cannot be negative.'],
      validate: {
        validator: Number.isInteger,
        message: 'Egg count must be a whole number.'
      }
    },

    collectDate: {
      type: Date,
      required: [true, 'Please select a collection date.']
    },

    active: {
      type: Number,
      required: [true, 'Active hen count is required.'],
      min: [0, 'Active hen count cannot be negative.'],
      validate: {
        validator: Number.isInteger,
        message: 'Active hen count must be a whole number.'
      }
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

productionSchema.index(
  { poultry: 1, collectDate: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false
    }
  }
)

export const Production = mongoose.model('Production', productionSchema)