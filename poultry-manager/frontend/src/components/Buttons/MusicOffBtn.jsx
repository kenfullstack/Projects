import styles from './MusicOffBtn.module.css'
import MusicOffBtnIcon from '../../assets/icons/musicOffBtn.svg?react'

const MusicOffBtn = ({ onClick }) => {
  return (
    <button
      className={styles.musicButton}
      onClick={onClick}
    >
      <MusicOffBtnIcon />
    </button>
  )
}

export default MusicOffBtn