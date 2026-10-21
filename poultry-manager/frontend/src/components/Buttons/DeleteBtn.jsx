import styles from './DeleteBtn.module.css'
import DeleteBtnIcon from '../../assets/icons/deleteBtn.svg?react'
const DeleteBtn = ({onClick}) => {
  return (
      <button 
      className={styles.deleteBtn}
      onClick={onClick}><DeleteBtnIcon /></button>
  )
}

export default DeleteBtn