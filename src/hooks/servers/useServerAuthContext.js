import { useContext } from "react";
import { ServerAuthContext } from "../../context/servers/ServerAuthContext";

export function useServerAuthContext() {
  const context = useContext(ServerAuthContext);
  if (!context) {
    throw new Error(
      "useServerAuthContext must be used inside ServerAuthProvider"
    );
  }
  return context;
}
