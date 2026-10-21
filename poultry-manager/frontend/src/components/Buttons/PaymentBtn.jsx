import { useState } from 'react';
import styles from './PaymentBtn.module.css';

const PaymentBtn = () => {
  const [status, setStatus] = useState('unpaid');

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={`${styles.paymentBtn} ${status === 'paid' ? styles.paidActive : styles.paidInactive}`}
        onClick={() => setStatus('paid')}
      >
        Paid
      </button>

      <button
        type="button"
        className={`${styles.paymentBtn} ${status === 'unpaid' ? styles.unpaidActive : styles.unpaidInactive}`}
        onClick={() => setStatus('unpaid')}
      >
        Unpaid
      </button>
    </div>
  );
};

export default PaymentBtn;