import styles from './ChooseBtn.module.css'
const ChooseBtn = ({ htmlFor, className }) => {
  return (
    <label
      className={`${styles.chooseBtn} ${className}`}
      htmlFor={htmlFor}
    >
      Choose File
    </label>
  )
}

export default ChooseBtn