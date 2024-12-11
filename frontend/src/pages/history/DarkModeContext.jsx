import React, { createContext, useContext, useState, useEffect } from "react";

export const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);
export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkmodechoice")) || false;
  });

  useEffect(() => {
    localStorage.setItem("darkmodechoice", JSON.stringify(isDarkMode));
    document.body.style.backgroundColor = isDarkMode ? "#242c24" : "#f9fef9";
    document.body.style.color = isDarkMode ? "white" : "black";
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
