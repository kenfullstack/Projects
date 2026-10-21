
import { createContext, useContext, useEffect, useState } from "react";
import api from '../../src/api/axios.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const PoultryContext = createContext();

export const PoultryProvider = ({ children }) => {
  const [poultry, setPoultry] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPoultry = async () => {
    setLoading(true);

    try {
      const response = await api.get("/poultry");
      setPoultry(response.data);
    } catch (error) {
      console.error("Failed to get poultry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PoultryContext.Provider
      value={{ poultry, setPoultry, loading, getPoultry }}
    >
      {children}
    </PoultryContext.Provider>
  );
};

export const usePoultry = () => useContext(PoultryContext);