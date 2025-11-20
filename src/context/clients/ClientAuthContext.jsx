import { createContext, useState, useEffect } from "react";
import { fetchProfile } from "../../api/clients/userApi";
import { logout } from "../../api/clients/authApi";
import toast from "react-hot-toast";

export const ClientAuthContext = createContext();

export const ClientAuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const autoFetchProfile = async () => {
      try {
        const myProfile = await fetchProfile();
        setAuthUser(myProfile);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    autoFetchProfile();
  }, []);

  const handleLogout = async (email) => {
    try {
      await logout(email);
      toast.success("Logout successfully!");

      setAuthUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
    handleLogout,
    loading, 
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};
