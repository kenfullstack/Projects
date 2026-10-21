import { useLocation } from 'react-router'
import styles from './BreadCrumb.module.css'
import farm from '../../assets/audio/farm.mp3'
import MusicOnBtn from '../Buttons/MusicOnBtn'
import MusicOffBtn from '../Buttons/MusicOffBtn'
import { useRef, useState } from 'react'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const BreadCrumb = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const toggleMusic = async () => {
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    try {
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('Unable to play music:', error)
    }

  }

  const location = useLocation()

  const pageNames = {
    '/dashboard': 'Dashboard',
    '/poultry': 'Poultry',
    '/poultry/add': 'Add Poultry Batch',
    '/finance': 'Finance',
    '/finance/add': 'Add Transaction',
    '/production': 'Production',
    '/production/add': 'Add Production Record',
    '/create-account': 'Create Account'
  }

  const currentPage =
    pageNames[location.pathname] ||
    (location.pathname.startsWith('/poultry/edit/')
      ? 'Edit Poultry Batch'
      : location.pathname.startsWith('/finance/edit/')
        ? 'Edit Transaction'
        : location.pathname.startsWith('/production/edit/')
          ? 'Edit Production Record'
          : 'Dashboard')

  return (
    <header className={styles.breadCrumb}>
      <div className={styles.crumbText}>
        <p> My Workspace </p>
        <p><span aria-hidden="true">›</span></p>
        <p><span className={styles.currentPage}> {currentPage}</span></p>
      </div>
      <div
        className={`${styles.music} ${isPlaying ? styles.musicOn : styles.musicOff}`}
        onClick={toggleMusic}>
        {isPlaying ? <MusicOnBtn /> : <MusicOffBtn />}
      </div>

      <audio
        ref={audioRef}
        src={farm}
        loop
        preload="none"
      />
    </header >
  )
}

export default BreadCrumb