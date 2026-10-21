import chickenImg from '../../assets/images/chickenImg10.png'
import styles from './Dashboard.module.css'
import BreedIcon from '../../components/Emoticons/BreedIcon.jsx'
import EggIcon from '../../components/Emoticons/EggIcon.jsx'
import EggsIcon from '../../components/Emoticons/EggsIcon.jsx'
import ProfitIcon from '../../components/Emoticons/ProfitIcon.jsx'
import { useEffect } from 'react'
import { usePoultry } from "../../context/PoultryContext"
import { useFinance } from "../../context/FinanceContext"
import { useProduction } from "../../context/ProductionContext"

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const Dashboard = () => {
  const { poultry, loading: poultryLoading, getPoultry } = usePoultry();
  const { monthlyFinance, loading: financeLoading, getMonthlyFinance } = useFinance();
  const { eggMonthly, loading: productionLoading, getEggMonthly, getProduction } = useProduction();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const allActive = poultry.reduce(
    (acc, batch) => acc + batch.active,
    0
  );

  const currentMonthEggRecords = eggMonthly.filter(
    (record) =>
      record.year === currentYear &&
      record.month === currentMonth
  );

  const allEggCount = currentMonthEggRecords.reduce(
    (acc, record) => acc + record.totalEggs,
    0
  );

  const allActiveHenDays = currentMonthEggRecords.reduce(
    (acc, record) => acc + record.totalActiveHenDays,
    0
  );

  const allEggMonthlyEfficiency =
    allActiveHenDays > 0
      ? (allEggCount / allActiveHenDays) * 100
      : 0;

  const currentMonthFinance = monthlyFinance.find(
    (record) =>
      record.year === currentYear &&
      record.month === currentMonth
  );

  const allMonthlyNet = currentMonthFinance?.netProfit ?? 0;


  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  useEffect(() => {
    getPoultry();
    getMonthlyFinance();
    getEggMonthly();
    getProduction();
  }, []);

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  if (poultryLoading || financeLoading || productionLoading) {
    return <p>Loading dashboard...</p>
  }

  const reportMonths = [
    ...new Map(
      [
        ...monthlyFinance,
        ...eggMonthly,
      ].map((record) => [
        `${record.year}-${record.month}`,
        {
          year: record.year,
          month: record.month,
        },
      ])
    ).values(),
  ].sort(
    (a, b) =>
      b.year - a.year || b.month - a.month
  );

  // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  return (
    <>
      <h1>Dashboard</h1>
      <p className={styles.subText}>Your farm at a glance.</p>

      <div className={styles.imageWrapper}>
        <div className={styles.imageText}>
          <h2>A better day starts with a better view.</h2>
          <p className={styles.subText}>From your flock to your finances, everything you need is right here.</p>
        </div>
        <img
          src={chickenImg}
          alt='' />
      </div>

      <h2>Current monthly summary</h2>
      <div className={styles.overviewWrapper}>
        <div className={styles.box}>
          <BreedIcon />
          <p className={styles.subText}><b>Active birds</b></p>
          <p className={styles.mainText}>{allActive}</p>
        </div>

        <div className={styles.box}>
          <EggIcon />
          <p className={styles.subText}><b>Eggs collected</b></p>
          <p className={styles.mainText}>{allEggCount.toLocaleString()}</p>
        </div>

        <div className={styles.box}>
          <EggsIcon />
          <p className={styles.subText}><b>Eggs efficiency</b></p>
          <p className={
            allEggMonthlyEfficiency >= 80
              ? styles.greenText
              : allEggMonthlyEfficiency >= 60
                ? styles.yellowText
                : styles.redText
          }>
            {allEggMonthlyEfficiency.toFixed(2)} %</p>
        </div>

        <div className={styles.box}>
          <ProfitIcon />
          <p className={styles.subText}><b>Net Profit</b></p>
          <p className={allMonthlyNet >= 0 ? styles.greenText : styles.redText}>₱ {allMonthlyNet}</p>
        </div>
      </div >

      <h2>Monthly reports</h2>
      <div className={styles.monthlyReportWrapper}>
        {reportMonths.map((report) => {
          const monthlyEggRecords = eggMonthly.filter(
            (record) =>
              record.year === report.year &&
              record.month === report.month
          );

          const totalEggs = monthlyEggRecords.reduce(
            (acc, record) => acc + record.totalEggs,
            0
          );

          const totalActiveHenDays = monthlyEggRecords.reduce(
            (acc, record) => acc + record.totalActiveHenDays,
            0
          );

          const eggMonthlyEfficiency =
            totalActiveHenDays > 0
              ? (totalEggs / totalActiveHenDays) * 100
              : 0;

          const financeRecord = monthlyFinance.find(
            (record) =>
              record.year === report.year &&
              record.month === report.month
          );

          const netProfit = financeRecord?.netProfit ?? 0;
          const income = financeRecord?.income ?? 0;
          const expense = financeRecord?.expense ?? 0;

          return (
            <div
              className={styles.monthlyTransactionCard}
              key={`${report.year}-${report.month}`}
            >
              <div className={styles.monthYear}>
                {new Date(
                  report.year,
                  report.month - 1
                ).toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <div className={styles.monthlyTransactions}>
                <div>
                  <p className={styles.subText}>Net Profit</p>
                  <p className={
                    netProfit >= 0
                      ? styles.greenText
                      : styles.redText
                  }>
                    ₱ {netProfit}
                  </p>
                </div>

                <div>
                  <p className={styles.subText}>Income</p>
                  <p className={styles.mainText}>
                    ₱ {income}
                  </p>
                </div>

                <div>
                  <p className={styles.subText}>Expenses</p>
                  <p className={styles.mainText}>
                    ₱ {expense}
                  </p>
                </div>
              </div>

              <div className={styles.eggMonthlyWrapper}>
                <div>
                  <p className={styles.subText}>Egg efficiency</p>
                  <p className={
                    eggMonthlyEfficiency >= 80
                      ? styles.greenText
                      : eggMonthlyEfficiency >= 60
                        ? styles.yellowText
                        : styles.redText
                  }>
                    {eggMonthlyEfficiency.toFixed(2)} %
                  </p>
                </div>

                <div>
                  <p className={styles.subText}>Total eggs</p>
                  <p className={styles.mainText}>
                    {totalEggs.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  )
}

export default Dashboard