import { createContext, useState } from "react";

export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [header, setHeader] = useState({
    title: "",
    breadcrumb: [],
  });

  return (
    <HeaderContext.Provider value={{ header, setHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};
