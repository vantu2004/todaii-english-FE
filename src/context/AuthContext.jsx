// context/AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
    appLoading,
    setAppLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


