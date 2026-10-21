import { Outlet } from 'react-router'
import Navbar from '../components/NavBar/NavBar.jsx'
import BreadCrumb from '../components/BreadCrumb/BreadCrumb.jsx'
import styles from './Layout.module.css'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const Layout = () => {
  return (
    <>
      <Navbar />

      <div className={styles.pageArea}>
        <BreadCrumb />

        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default Layout