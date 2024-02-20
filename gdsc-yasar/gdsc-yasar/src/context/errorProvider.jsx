import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ErrorContext = createContext();

export const useError = () => {
  return useContext(ErrorContext);
};

const ErrorContextProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const createErrorMessage = (errorMessage) => {
    setError(errorMessage);
    let interval = setInterval(() => {
        setError(null);
        clearInterval(interval);
    }, 2000)
  };


  return (
    <ErrorContext.Provider value={{ error, createErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContextProvider;
