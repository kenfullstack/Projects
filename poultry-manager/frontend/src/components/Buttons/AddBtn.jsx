import styles from './AddBtn.module.css'
import AddBtnIcon from '../../assets/icons/addBtn.svg?react'
const AddBtn = ({ onClick }) => {
  return (
    <button
      className={styles.addBtn}
      onClick={onClick}>
      <AddBtnIcon />Add
    </button>
  )
}

export default AddBtn