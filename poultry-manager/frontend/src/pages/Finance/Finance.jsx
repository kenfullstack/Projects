import styles from './Finance.module.css'
import { useEffect, useState } from 'react'
import AddBtn from '../../components/Buttons/AddBtn.jsx'
import EditBtn from '../../components/Buttons/EditBtn.jsx'
import DeleteBtn from '../../components/Buttons/DeleteBtn.jsx'
import { useFinance } from '../../context/FinanceContext'
import { useNavigate } from 'react-router'
import api from '../../api/axios.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const Finance = () => {
  const navigate = useNavigate()
  const {
    finance,
    setFinance,
    getFinance,
    loading
  } = useFinance()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getFinance();
  }, [])

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const handleAdd = () => navigate('/finance/add')
  const handleEdit = (id) => navigate(`/finance/edit/${id}`)
  const handleDelete = (id) => deleteFinance(id)

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const deleteFinance = async (_id) => {
    try {
      await api.delete(`/finance/${_id}`)
      setFinance((previousFinance) => previousFinance.filter((record) => record._id !== _id))
      await getFinance()
    } catch (error) {
      console.error(error)
    }
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
      })
      .replaceAll('/', '-')
  }

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  const filteredFinance = finance
    .filter((record) =>
      filter === 'all' || record.transactionType === filter
    )
    .sort((a, b) =>
      new Date(b.deliveryDate) - new Date(a.deliveryDate)
    )

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  return (
    <>
      <header className={styles.financePageHeader}>
        <div className={styles.headerText}>
          <h1>Finance</h1>
          <p className={styles.subText}>Every dollar in and out, all in one place.</p>
        </div>
        <AddBtn onClick={handleAdd} />
      </header>

      <div className={styles.transactionBtnWrapper}>
        <button
          className={`${styles.transactionBtn} ${filter === 'all'
            ? styles.activeAllBtn
            : styles.inactiveAllBtn
            }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>

        <button
          className={`${styles.transactionBtn} ${filter === 'income'
            ? styles.activeIncomeBtn
            : styles.inactiveIncomeBtn
            }`}
          onClick={() => setFilter('income')}
        >
          Income
        </button>

        <button
          className={`${styles.transactionBtn} ${filter === 'expense'
            ? styles.activeExpenseBtn
            : styles.inactiveExpenseBtn
            }`}
          onClick={() => setFilter('expense')}
        >
          Expense
        </button>
      </div>

      <h2>Transaction records</h2>
      <div className={styles.transactionWrapper}>
        {loading ? (
          <p>Loading finance records...</p>
        ) : (
          filteredFinance.map((record) => (
            <div
              className={styles.transactionCard}
              key={record._id}
            >
              <div className={styles.transactionText}>
                <p>
                  <span className={styles.subText}>Type</span>
                </p>
                <p>
                  <span className={styles.mainText}>
                    {record.transactionType === 'income'
                      ? 'Income'
                      : 'Expense'}
                  </span>
                </p>
              </div>

              <div className={styles.calcTotalText}>
                <p>
                  <span className={styles.subText}>Total</span>
                </p>
                <p>
                  <span className={styles.mainText}>
                    {record.transactionType === 'expense'
                      ? '-₱ '
                      : '₱ '}
                    {record.calculatedTotal}
                  </span>
                </p>
              </div>

              <div className={styles.paymentStatusText}>
                <p>
                  <span className={styles.subText}>Status</span>
                </p>
                <p>
                  <span className={record.paymentStatus === 'paid' ? styles.greenText : styles.redText}>
                    {record.paymentStatus === 'paid'
                      ? 'Paid'
                      : 'Pending'}
                  </span>
                </p>
              </div>

              <div className={styles.categoryText}>
                <p>
                  <span className={styles.subText}>Category</span>
                </p>
                <p>
                  <span className={styles.mainText}>
                    {record.category}
                  </span>
                </p>
              </div>

              <div className={styles.amountText}>
                <p>
                  <span className={styles.subText}>Amount</span>
                </p>
                <p>
                  <span className={styles.mainText}>
                    ₱ {record.amount}
                  </span>
                </p>
              </div>

              <div className={styles.quantityText}>
                <p>
                  <span className={styles.subText}>Quantity</span>
                </p>
                <p>
                  <span className={styles.mainText}>
                    {record.quantity}
                  </span>
                </p>
              </div>

              <div className={styles.deliveryText}>
                <p>
                  <span className={styles.subText}>
                    Delivery Date
                  </span>
                </p>
                <p>
                  <span className={styles.date}>
                    {formatDate(record.deliveryDate)}
                  </span>
                </p>
              </div>

              <div className={styles.paymentDateText}>
                <p>
                  <span className={styles.subText}>
                    Pay Date
                  </span>
                </p>
                <p>
                  <span className={styles.date}>
                    {formatDate(record.paymentDate)}
                  </span>
                </p>
              </div>

              <div className={styles.descriptionText}>
                <p>
                  <span className={styles.subText}>
                    Description
                  </span>
                </p>
                <p>
                  <span className={styles.mainText}>
                    {record.description || '—'}
                  </span>
                </p>
              </div>

              <div className={styles.financeCardActions}>
                <EditBtn
                  onClick={() => handleEdit(record._id)}
                />
                <DeleteBtn
                  onClick={() => handleDelete(record._id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default Finance