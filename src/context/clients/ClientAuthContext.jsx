import { createContext, useState, useEffect } from "react";
import { fetchProfile } from "../../api/clients/userApi";

export const ClientAuthContext = createContext();

export const ClientAuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const autoFetchProfile = async () => {
      try {
        const myProfile = await fetchProfile();
        setAuthUser(myProfile);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Lỗi khi lấy profile:", error);
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
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};
