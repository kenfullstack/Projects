
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import AddBtn from '../../components/Buttons/AddBtn.jsx'
import EditBtn from '../../components/Buttons/EditBtn.jsx'
import DeleteBtn from '../../components/Buttons/DeleteBtn.jsx'
import api from '../../api/axios.js'
import styles from './Production.module.css'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const Production = () => {
  const [production, setProduction] = useState([])
  const [eggMonthly, setEggMonthly] = useState([])
  const [poultry, setPoultry] = useState([])
  const [filter, setFilter] = useState('all')

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}`
  })

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const navigate = useNavigate()

  const handleAdd = () => navigate('/production/add')
  const handleEdit = (id) => navigate(`/production/edit/${id}`)
  const handleDelete = (id) => deleteProduction(id)
  const handleChange = (e) => setFilter(e.target.value)

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  useEffect(() => {
    const getProduction = async () => {
      try {
        const response = await api.get('/production')
        setProduction(response.data)
      } catch (error) {
        console.error('Error fetching production:', error)
      }
    }

    const getEggMonthly = async () => {
      try {
        const response = await api.get('/production/monthly')
        setEggMonthly(response.data)
      } catch (error) {
        console.error('Error fetching monthly egg efficiency:', error)
      }
    }

    getProduction()
    getEggMonthly()
  }, [])

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  useEffect(() => {
    const getPoultry = async () => {
      try {
        const response = await api.get('/poultry')
        setPoultry(response.data)
      } catch (error) {
        console.error('Error fetching poultry batches:', error)
      }
    }

    getPoultry()
  }, [])

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const deleteProduction = async (id) => {
    try {
      await api.delete(`/production/${id}`)

      setProduction((previousProduction) =>
        previousProduction.filter((record) => record._id !== id)
      )

      const response = await api.get('/production/monthly')
      setEggMonthly(response.data)
    } catch (error) {
      console.error('Error deleting production:', error)
    }
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const selectedYear = Number(selectedMonth.split('-')[0])
  const selectedMonthNumber = Number(selectedMonth.split('-')[1])

  const filteredEggMonthly = eggMonthly.filter((record) => {
    const matchesMonth =
      record.year === selectedYear &&
      record.month === selectedMonthNumber

    const matchesBatch =
      filter === 'all' ||
      record.poultry === filter

    return matchesMonth && matchesBatch
  })

  const filteredProduction = production
    .filter((record) => {
      const matchesBatch =
        filter === 'all' ||
        record.poultry?.batchName === filter

      const recordDate = new Date(record.collectDate)

      const recordMonth = `${recordDate.getFullYear()}-${String(
        recordDate.getMonth() + 1
      ).padStart(2, '0')}`

      const matchesMonth = recordMonth === selectedMonth

      return matchesBatch && matchesMonth
    })
    .sort(
      (a, b) =>
        new Date(b.collectDate) - new Date(a.collectDate)
    )

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  return (
    <>
      <header className={styles.productionHeader}>
        <div className={styles.headerText}>
          <h1>Production</h1>
          <p className={styles.subText}>
            Track each egg collected.
          </p>
        </div>

        <AddBtn onClick={handleAdd} />
      </header>

      <div className={styles.filtersWrapper}>
        <label>
          <select
            className={styles.batchFilter}
            name="filter"
            value={filter}
            onChange={handleChange}
          >
            <option value="all">All</option>

            {poultry.map((batch) => (
              <option key={batch._id} value={batch.batchName}>
                {batch.batchName}
              </option>
            ))}
          </select>
        </label>

        <label>
          <input
            className={styles.monthFilter}
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </label>
      </div>

      <h2>Monthly production record</h2>

      <div className={styles.monthlyEggRecordCardWrapper}>
        {filteredEggMonthly.length > 0 ? (
          filteredEggMonthly.map((record) => {

            return (
              <div
                className={styles.monthlyRecordCard}
                key={`${record.poultry}-${record.year}-${record.month}`}
              >
                <div className={styles.batchWrapper}>
                  <h2>{record.poultry}</h2>
                </div>

                <div className={styles.collectDateWrapper}>
                  <div className={styles.monthYear}>
                    {new Date(`${selectedMonth}-02T00:00:00`).toLocaleDateString(
                      'en-US',
                      { month: 'long' }
                    )}
                  </div>
                </div>

                <div>
                  <p className={styles.subText}>Total eggs</p>
                  <p className={styles.mainText}>{record.totalEggs} pcs</p>
                </div>

                <div>
                  <p className={styles.subText}>Monthly efficiency</p>
                  <p className={
                    record.eggMonthlyEfficiency >= 80
                      ? styles.greenText
                      : record.eggMonthlyEfficiency >= 60
                        ? styles.yellowText
                        : styles.redText
                  }>{record.eggMonthlyEfficiency.toFixed(2)} %</p>
                </div>

              </div>
            )
          })
        ) : (
          <p>No monthly efficiency records for this selection.</p>
        )}
      </div >

      <h2>Daily production record</h2>

      <div className={styles.eggRecordCardWrapper}>
        {filteredProduction.length > 0 ? (
          filteredProduction.map((record) => (
            <div
              className={styles.eggRecordCard}
              key={record._id}
            >
              <div className={styles.batchWrapper}>
                <h2>
                  {record.poultry?.batchName || 'Unknown batch'}
                </h2>
              </div>

              <div className={styles.collectDateWrapper}>
                <div className={styles.monthYear}>
                  {new Date(
                    record.collectDate
                  ).toLocaleDateString('en-US', {
                    month: 'long',
                    day: '2-digit',
                    year: 'numeric',
                    timeZone: 'Asia/Manila'
                  })}
                </div>
              </div>

              <div className={styles.eggDailyWrapper}>
                <p>
                  <span className={styles.subText}>
                    Eggs collected
                  </span>
                </p>

                <p>
                  <span className={styles.eggCountText}>
                    {record.eggCount} pcs
                  </span>
                </p>
              </div>

              <div className={styles.eggActionsWrapper}>
                <EditBtn
                  onClick={() => handleEdit(record._id)}
                />

                <DeleteBtn
                  onClick={() => handleDelete(record._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No egg harvest records for this selection.</p>
        )}
      </div>
    </>
  )
}

export default Production