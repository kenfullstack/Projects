import AddBtn from '../../components/Buttons/AddBtn.jsx'
import styles from './Poultry.module.css'
import { useState, useEffect } from 'react'
import EditBtn from '../../components/Buttons/EditBtn.jsx'
import DeleteBtn from '../../components/Buttons/DeleteBtn.jsx'
import BreedIcon from '../../components/Emoticons/BreedIcon.jsx'
import AgeIcon from '../../components/Emoticons/AgeIcon.jsx'
import api from '../../api/axios.js'
import { useNavigate } from 'react-router'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const Poultry = () => {
  const now = new Date()
  const msInAWeek = 7 * 24 * 60 * 60 * 1000
  const [poultry, setPoultry] = useState([])
  const navigate = useNavigate()

  const handleAdd = () => navigate('/poultry/add')
  const handleEdit = (id) => navigate(`/poultry/edit/${id}`)
  const handleDelete = (id) => deletePoultry(id)

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  useEffect(() => {
    const getPoultry = async () => {
      try {
        const response = await api.get('/poultry')
        setPoultry(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    getPoultry()
  }, [])

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const deletePoultry = async (_id) => {
    try {
      await api.delete(`/poultry/${_id}`)
      setPoultry((previousPoultry) =>
        previousPoultry.filter((batch) => batch._id !== _id)
      )
    } catch (error) {
      console.error(error)
    }
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  return (
    <>
      <header className={styles.poultryPageHeader}>
        <div className={styles.headerText}>
          <h1>Poultry</h1>
          <p className={styles.subText}>A home for every flock on your farm.</p>
        </div>
        <AddBtn
          onClick={handleAdd} />
      </header>

      <h2>Poultry batches</h2>
      <div className={styles.poultryCardWrapper}>
        {poultry.map((batch) => {
          const inactive = batch.total - batch.active
          const ageInWeeks = Math.floor((now - new Date(batch.birthday)) / msInAWeek)

          return (
            <div className={styles.poultryCard} key={batch._id}>

              <div className={styles.poultryContent}>
                <div className={styles.batchNameText}>
                  <h2>{batch.batchName}</h2>
                </div>

                <div className={styles.breedImageWrapper}>
                  <img className={styles.breedImage} src={batch.image} alt={batch.breed} />
                </div>

                <div className={styles.poultryDetails}>
                  <div className={styles.breedNameText}>
                    <div>
                      <p><span className={styles.subText}>Breed</span></p>
                      <p><span className={styles.mainText}>{batch.breed}</span></p>
                    </div>
                    <BreedIcon />
                  </div>

                  <div className={styles.poultryAgeText}>
                    <div>
                      <p><span className={styles.subText}>Age</span></p>
                      <p><span className={styles.mainText}>{ageInWeeks} weeks</span></p>
                    </div>
                    <AgeIcon />
                  </div>
                </div>

                <div className={styles.poultryCountsWrapper}>
                  <div className={styles.poultryCounts}>
                    <p><span className={styles.subText}>Total:</span></p>
                    <p><span className={styles.totalText}>{batch.total}</span></p>
                  </div>

                  <div className={styles.poultryCounts}>
                    <p><span className={styles.subText}>Active:</span></p>
                    <p><span className={styles.activeText}>{batch.active}</span></p>
                  </div>

                  <div className={styles.poultryCounts}>
                    <p><span className={styles.subText}>Inactive:</span></p>
                    <p><span className={styles.inactiveText}>{inactive}</span></p>
                  </div>
                </div>

                <div className={styles.poultryCardActions}>
                  <EditBtn onClick={() => handleEdit(batch._id)} />
                  <DeleteBtn onClick={() => handleDelete(batch._id)} />
                </div>

              </div>

            </div>
          )
        })}
      </div>
    </>
  )
}

export default Poultry