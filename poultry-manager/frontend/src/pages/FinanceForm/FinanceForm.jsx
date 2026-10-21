import styles from './FinanceForm.module.css'
import { useState, useEffect } from 'react'
import SaveBtn from '../../components/Buttons/SaveBtn'
import CancelBtn from '../../components/Buttons/CancelBtn'
import { useNavigate, useParams } from 'react-router'
import api from '../../api/axios.js'
import { useFinance } from '../../context/FinanceContext'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const FinanceForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getFinance, getMonthlyFinance } = useFinance()
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState([])
  const [formData, setFormData] = useState({
    transactionType: '',
    paymentStatus: '',
    category: '',
    magnitude: '',
    amount: '',
    quantity: '',
    description: '',
    deliveryDate: '',
    paymentDate: ''
  })

  const calculatedTotal = Number(formData.amount || 0) * Number(formData.quantity || 0)

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const handleCancel = () => navigate('/finance')
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors([])
    setIsSaving(true)

    try {
      await saveFinance({ ...formData, calculatedTotal })
      await getFinance()
      await getMonthlyFinance()
      navigate('/finance')
    } catch (error) {
      const responseData = error.response?.data

      if (responseData?.messages) {
        setErrors(responseData.messages)
      } else if (responseData?.message) {
        setErrors([responseData.message])
      } else {
        setErrors(['Something went wrong. Please try again.'])
      }
    } finally {
      setIsSaving(false)
    }
  }


  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  useEffect(() => {
    if (!id) return

    const getFinanceById = async () => {
      try {
        const response = await api.get(`/finance/${id}`)
        const existingData = response.data

        setFormData({
          transactionType: existingData.transactionType,
          paymentStatus: existingData.paymentStatus,
          category: existingData.category,
          magnitude: existingData.magnitude,
          amount: existingData.amount,
          quantity: existingData.quantity,
          description: existingData.description,
          deliveryDate: existingData.deliveryDate
            ? existingData.deliveryDate.split('T')[0]
            : '',
          paymentDate: existingData.paymentDate
            ? existingData.paymentDate.split('T')[0]
            : ''
        })
      } catch (error) {
        console.error('Error getting finance:', error)
      }
    }

    getFinanceById()
  }, [id])

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const saveFinance = async (data) => {
    if (id) {
      const response = await api.put(`/finance/${id}`, data)
      return response.data
    }

    const response = await api.post('/finance', data)
    return response.data
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  return (
    <div className={styles.wholeFormWrapper}>
      <h1>Finance Form</h1>

      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className={styles.errorMessages}>
            <p>Please correct the following errors:</p>

            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className={styles.toggleBtnWrapper}>
            <div className={styles.toggleBtn1}>
              <p>Transaction Type</p>

              <div className={styles.container}>
                <button
                  type="button"
                  className={`${styles.transactionBtn} ${formData.transactionType === 'income'
                    ? styles.incomeActive
                    : styles.incomeInactive
                    }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      transactionType: 'income'
                    })
                  }
                >
                  Income
                </button>

                <button
                  type="button"
                  className={`${styles.transactionBtn} ${formData.transactionType === 'expense'
                    ? styles.expenseActive
                    : styles.expenseInactive
                    }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      transactionType: 'expense'
                    })
                  }
                >
                  Expense
                </button>
              </div>
            </div>

            <div className={styles.toggleBtn2}>
              <p>Payment Status</p>

              <div className={styles.container}>
                <button
                  type="button"
                  className={`${styles.paymentBtn} ${formData.paymentStatus === 'paid'
                    ? styles.paidActive
                    : styles.paidInactive
                    }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      paymentStatus: 'paid'
                    })
                  }
                >
                  Paid
                </button>

                <button
                  type="button"
                  className={`${styles.paymentBtn} ${formData.paymentStatus === 'pending'
                    ? styles.pendingActive
                    : styles.pendingInactive
                    }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      paymentStatus: 'pending',
                      paymentDate: ''
                    })
                  }
                >
                  Pending
                </button>
              </div>
            </div>
          </div>

          <div className={styles.formInputs}>
            <label>
              Category
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder={
                  formData.transactionType === 'income'
                    ? 'Eggs sale'
                    : 'Purchase feeds'
                }
              />
            </label>

            <label>
              Magnitude/unit
              <input
                type="text"
                name="magnitude"
                value={formData.magnitude}
                onChange={handleChange}
                placeholder={
                  formData.transactionType === 'income'
                    ? 'tray'
                    : '50 kg sack'
                }
              />
            </label>

            <label>
              Amount per unit (PHP)
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </label>

            <label>
              Quantity
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="5"
              />
            </label>

            <label>
              Description
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={formData.transactionType === 'income' ? 'Sold to customer name' : 'Purchase feeds from supplier name'}
              />
            </label>

            <div className={styles.calculatedTotal}>
              <p>
                <span className={styles.subText}>
                  Calculated Total
                </span>
              </p>
              <p>
                <span className={styles.mainText}>
                  PHP {calculatedTotal.toFixed(2)}
                </span>
              </p>
            </div>

            <label>
              Delivery date
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
              />
            </label>

            <label>
              Payment date
              <input
                type="date"
                name="paymentDate"
                disabled={formData.paymentStatus === 'pending'}
                value={formData.paymentDate}
                onChange={handleChange}
              />
            </label>

            <div className={styles.formActions}>
              <CancelBtn
                onClick={handleCancel}
                disabled={isSaving}
              />

              <SaveBtn
                disabled={isSaving}
                isSaving={isSaving}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FinanceForm