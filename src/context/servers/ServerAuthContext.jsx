import { createContext, useState, useEffect } from "react";
import { fetchProfile } from "../../api/servers/adminApi";

export const ServerAuthContext = createContext();

export const ServerAuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const autoFetchProfile = async () => {
      try {
        const myProfile = await fetchProfile();
        setAuthUser(myProfile);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    autoFetchProfile();
  }, []);

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <ServerAuthContext.Provider value={value}>
      {children}
    </ServerAuthContext.Provider>
  );
};
