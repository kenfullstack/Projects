import CancelBtnIcon from '../../assets/icons/cancelBtn.svg?react'
import styles from './CancelBtn.module.css'
const Cancel = ({onClick, disabled}) => {
  return (
    <button
      className={styles.cancelBtn}
      onClick={onClick}
      disabled={disabled}
      type='button'
    >
      <CancelBtnIcon />Cancel
    </button>
  )
}

export default Cancel