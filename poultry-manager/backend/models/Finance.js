import mongoose from 'mongoose'

const financeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    transactionType: {
      type: String,
      required: true,
      enum: ['expense', 'income']
    },

    paymentStatus: {
      type: String,
      required: true,
      enum: ['paid', 'pending']
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    magnitude: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    description: {
      type: String,
      required: true,
      trim: true
    },


    deliveryDate: {
      type: Date,
      required: [true, 'Please select a delivery date.']
    },

    paymentDate: {
      type: Date,
      required: [
        function () {
          return this.paymentStatus === 'paid'
        },
        'Please select a payment date for paid transactions.'
      ]
    },


    calculatedTotal: {
      type: Number,
      required: true,
      min: 0
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

financeSchema.pre('validate', function () {
  this.calculatedTotal = this.amount * this.quantity
})

export const Finance = mongoose.model('Finance', financeSchema)