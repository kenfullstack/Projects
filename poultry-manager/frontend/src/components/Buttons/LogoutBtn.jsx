import styles from './LogoutBtn.module.css'
import LogoutBtnIcon from '../../assets/icons/logoutBtn.svg?react'
const LogoutBtn = () => {
  return (
    <button
      className={styles.logoutBtn}>
      <LogoutBtnIcon />
    </button>
  )
}

export default LogoutBtn