const errorHandler = (error, req, res, next) => {

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(
      (validationError) => validationError.message
    )

    return res.status(400).json({
      messages
    })
  }

  if (error.code === 11000) {

    if (error.keyPattern?.batchName) {
      return res.status(409).json({
        message: 'A batch with this name already exists.'
      })
    }

    if (
      error.keyPattern?.poultry &&
      error.keyPattern?.collectDate
    ) {
      return res.status(409).json({
        message: 'A production record already exists for this batch and date.'
      })
    }

    if (error.keyPattern?.email) {
      return res.status(409).json({
        message: 'An account with this email already exists.'
      })
    }

    return res.status(409).json({
      message: 'A record with this value already exists.'
    })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID or data format.'
    })
  }

  console.error(error)

  return res.status(500).json({
    message: 'An unexpected server error occurred.'
  })
}

export default errorHandler