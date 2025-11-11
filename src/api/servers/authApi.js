import { serverInstance } from "../../config/axios";

export const login = async (email, password) => {
  try {
    await serverInstance.post("/auth/login", {
      email,
      password,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const logout = async (email) => {
  try {
    await serverInstance.post("/auth/logout", null, {
      params: { email },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
