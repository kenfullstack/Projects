import { createContext, useContext, useEffect, useState } from "react";
import api from '../../src/api/axios.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [finance, setFinance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyFinance, setMonthlyFinance] = useState([]);

  const getFinance = async () => {
    setLoading(true);

    try {
      const response = await api.get("/finance");
      setFinance(response.data);
    } catch (error) {
      console.error("Failed to get finance:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyFinance = async () => {
    setLoading(true);

    try {
      const response = await api.get('/finance/monthly');
      setMonthlyFinance(response.data);
    } catch (error) {
      console.error('Failed to get monthly finance', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        finance,
        setFinance,
        monthlyFinance,
        setMonthlyFinance,
        loading,
        getFinance,
        getMonthlyFinance
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);