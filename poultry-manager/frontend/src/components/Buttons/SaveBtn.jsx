import styles from './SaveBtn.module.css'
import SaveBtnIcon from '../../assets/icons/saveBtn.svg?react'
const SaveBtn = ({ disabled, isSaving }) => {
  return (
    <button
      className={styles.saveBtn}
      disabled={disabled}
      type='submit'>
      <SaveBtnIcon />
      {isSaving ? 'Saving...' : 'Save'}
    </button>
  )
}

export default SaveBtn