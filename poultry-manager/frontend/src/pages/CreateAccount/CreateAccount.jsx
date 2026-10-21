
import { useState } from 'react'
import { useNavigate } from 'react-router'
import api from '../../api/axios.js'
import styles from './CreateAccount.module.css'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const CreateAccount = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      await api.post('/workers', formData)

      navigate(-1)
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to create account. Please try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  return (
    <div className={styles.createAccountPage}>

      <form
        className={styles.createAccountForm}
        onSubmit={handleSubmit}
      >
        <header className={styles.pageHeader}>
          <h1>Create account</h1>
          <p>Create a worker account for your poultry farm.</p>
        </header>

        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder='Ken Chester'
          />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder='Quiteles'
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='kenken@gmail.com'
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && (
          <p className={styles.errorMessage}>{error}</p>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.createBtn}
            disabled={isSaving}
          >
            {isSaving ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAccount