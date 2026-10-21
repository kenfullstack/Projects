import styles from './NavBar.module.css'
import { NavLink, useNavigate } from 'react-router'
import DashboardIcon from '../../assets/icons/dashboard.svg?react'
import FinanceIcon from '../../assets/icons/finance.svg?react'
import PoultryIcon from '../../assets/icons/poultry.svg?react'
import ProductionIcon from '../../assets/icons/production.svg?react'
import LogoutBtn from '../Buttons/LogoutBtn.jsx'
import farmImg from '../../assets/images/farmImg.png'
import AddBtnIcon from '../../assets/icons/addBtn.svg?react'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const NavBar = () => {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isOwner = user?.role === 'Owner'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    navigate('/login')
  }

  return (
    <nav>
      <ul>
        <div className={styles.farmImg}>
          <img
            src={farmImg}
            alt='poultry logo' />
        </div>
        <li>
          <div className={styles.navLink} onClick={handleLogout}>
            <LogoutBtn />
            <span className={styles.navLabel}>Log Out</span>
          </div>
        </li>

        {isOwner && (
          <li>
            <NavLink
              to='/dashboard'
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }>
              <DashboardIcon />
              <span className={styles.navLabel}>Dashboard</span>
            </NavLink>
          </li>
        )}

        <li><NavLink
          to='/poultry'
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.navLink
          }>
          <PoultryIcon />
          <span className={styles.navLabel}>Poultry</span>
        </NavLink></li>

        {isOwner && (
          <li>
            <NavLink
              to='/finance'
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }>
              <FinanceIcon />
              <span className={styles.navLabel}>Finance</span>
            </NavLink>
          </li>
        )}

        <li><NavLink
          to='/production'
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.navLink
          }>
          <ProductionIcon />
          <span className={styles.navLabel}>Production</span>
        </NavLink></li>

        {isOwner && (
          <li>
            <NavLink
              to='/create-account'
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }>
              <div className={styles.createBtn}>
                <AddBtnIcon />
              </div>
              <span className={styles.navLabel}>Account</span>
            </NavLink>
          </li>
        )}
      </ul>
    </nav >
  )
}

export default NavBar