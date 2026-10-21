import styles from './EditBtn.module.css'
import EditBtnIcon from '../../assets/icons/editBtn.svg?react'
const EditBtn = ({ onClick }) => {
  return (
    <button
      className={styles.editBtn}
      onClick={onClick}>
      <EditBtnIcon />
    </button>
  )
}

export default EditBtn