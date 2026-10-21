import { useState } from 'react';
import styles from './TransactionBtn.module.css';

const TransactionBtn = ({onClick}) => {
  const [status, setStatus] = useState('expense');

  return (
    <div className={styles.container}>
      <button
        className={`${styles.transactionBtn} ${status === 'income' ? styles.incomeActive : styles.incomeInactive}`}
        onClick={() => setStatus('income')}
      >
        Income
      </button>

      <button
        className={`${styles.transactionBtn} ${status === 'expense' ? styles.expenseActive : styles.expenseInactive}`}
        onClick={() => setStatus('expense')}
      >
        Expense
      </button>
    </div>
  );
};

export default TransactionBtn;