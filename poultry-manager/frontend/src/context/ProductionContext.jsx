
import { createContext, useContext, useEffect, useState } from "react";
import api from '../../src/api/axios.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const ProductionContext = createContext();

export const ProductionProvider = ({ children }) => {
  const [production, setProduction] = useState([]);
  const [eggMonthly, setEggMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProduction = async () => {
    setLoading(true);

    try {
      const response = await api.get(
        "/production"
      );
      setProduction(response.data);
    } catch (error) {
      console.error("Failed to get production:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEggMonthly = async () => {
    try {
      const response = await api.get("/production/monthly");
      setEggMonthly(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProductionContext.Provider
      value={{
        production,
        setProduction,
        loading,
        getProduction,
        eggMonthly,
        setEggMonthly,
        getEggMonthly
      }}
    >
      {children}
    </ProductionContext.Provider>
  );
};

export const useProduction = () => useContext(ProductionContext);
