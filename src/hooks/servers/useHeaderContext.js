import { useContext } from "react";
import { HeaderContext } from "../../context/servers/HeaderContext";

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used inside HeaderProvider");
  }
  return context;
}
