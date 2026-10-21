import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import CancelBtn from '../../components/Buttons/CancelBtn.jsx'
import SaveBtn from '../../components/Buttons/SaveBtn.jsx'
import api from '../../api/axios.js'
import styles from './ProductionForm.module.css'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const ProductionForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [poultry, setPoultry] = useState([])
  const [errors, setErrors] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    poultry: '',
    eggCount: '',
    collectDate: ''
  })

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const handleCancel = () => navigate('/production')
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSaving) return

    setErrors([])
    setIsSaving(true)

    try {
      await saveProduction(formData)
      navigate('/production')
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

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  useEffect(() => {
    const getPoultry = async () => {
      try {
        const response = await api.get('/poultry')
        setPoultry(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    getPoultry()
  }, [])

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  useEffect(() => {
    if (!id) return

    const getProductionById = async () => {
      try {
        const response = await api.get(`/production/${id}`)
        const existingData = response.data

        let poultryId = ''

        if (existingData.poultry) {
          poultryId = existingData.poultry._id
            ? existingData.poultry._id
            : existingData.poultry
        }

        setFormData({
          poultry: poultryId,
          eggCount: existingData.eggCount,
          collectDate: existingData.collectDate
            ? existingData.collectDate.split('T')[0]
            : ''
        })
      } catch (error) {
        console.error(error)
      }
    }

    getProductionById()
  }, [id])

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const saveProduction = async (data) => {
    try {
      if (id) {
        const response = await api.put(`/production/${id}`, data)
        return response.data
      } else {
        const response = await api.post('/production', data)
        return response.data
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  return (
    <div className={styles.wholeFormWrapper}>
      <header className={styles.productionFormHeader}>
        <h1>Production Form</h1>
      </header>

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

        <label>
          <select
            name="poultry"
            value={formData.poultry}
            onChange={handleChange}
          >
            <option value="">Select batch</option>

            {poultry.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.batchName}
              </option>
            ))}
          </select>
        </label>

        <br />

        <label>
          Eggs collected
          <input
            type="number"
            name="eggCount"
            value={formData.eggCount}
            onChange={handleChange}
            placeholder="100"
          />
        </label>

        <label>
          Date collected
          <input
            type="date"
            name="collectDate"
            value={formData.collectDate}
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
      </form>
    </div>
  )
}

export default ProductionForm