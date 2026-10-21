
import { useState } from 'react'
import { useNavigate } from 'react-router'
import api from '../../api/axios.js'
import styles from './Login.module.css'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoggingIn(true)

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })

      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      navigate('/dashboard')
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to log in. Please try again.'
      )
    } finally {
      setIsLoggingIn(false)
    }
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  return (
    <main className={styles.loginPage}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h1>Poultry Manager</h1>
        <p>Log in to manage your poultry farm.</p>

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

          <button
            type="submit"
            disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Log In'}
          </button>
      </form>
    </main>
  )
}

export default Login