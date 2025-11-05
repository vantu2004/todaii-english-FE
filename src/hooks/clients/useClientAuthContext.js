import { useContext } from "react";
import { ClientAuthContext } from "../../context/clients/ClientAuthContext";

export function useClientAuthContext() {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error(
      "useClientAuthContext must be used inside ClientAuthProvider"
    );
  }
  return context;
}
