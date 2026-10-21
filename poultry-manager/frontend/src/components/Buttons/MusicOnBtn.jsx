import styles from './MusicOnBtn.module.css'
import MusicOnBtnIcon from '../../assets/icons/musicOnBtn.svg?react'

const MusicOnBtn = ({ onClick }) => {
  return (
    <button
      className={styles.musicButton}
      onClick={onClick}
    >
      <MusicOnBtnIcon />
    </button>
  )
}

export default MusicOnBtn