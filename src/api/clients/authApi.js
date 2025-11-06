import { clientInstance } from "../../config/axios";

export const register = async (email, password, name) => {
  try {
    const response = await clientInstance.post("/auth/register", {
      email,
      password,
      display_name: name,
    });
    return response;
  } catch (err) {
    console.log("Error:", err);
    console.log("Status:", err.response.status);
    console.log("Error message:", err.response.data.message);
    console.error("Register error:", err);
    throw err;
  }
};

export const login = async (email, password) => {
  try {
    await clientInstance.post("/auth/login", {
      email,
      password,
    });
  } catch (err) {
    console.log("Error:", err);
    console.log("Status:", err.response.status);
    console.log("Error message:", err.response.data.message);
    console.error("Login error:", err);
    throw err;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await clientInstance.post("/auth/verify-otp", {
      email,
      otp,
    });
    return response;
  } catch (err) {
    console.log("Error:", err);
    console.log("Status:", err.response.status);
    console.log("Error message:", err.response.data.message);
    console.error("Verify error:", err);
    throw err;
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await clientInstance.get(
      `/auth/resend-otp?email=${email}`
    );
    return response;
  } catch (err) {
    console.log("Error:", err);
    console.log("Status:", err.response.status);
    console.log("Error message:", err.response.data.message);
    console.error("Resend otp error:", err);
    throw err;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await clientInstance.get(
      `/auth/forgot-password?email=${email}`
    );
    return response;
  } catch (err) {
    console.log("Error:", err);
    console.log("Status:", err.response.status);
    console.log("Error message:", err.response.data.message);
    console.error("Resend otp error:", err);
    throw err;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await clientInstance.post("/auth/reset-password", {
      reset_password_token: token,
      password: newPassword,
    });
    return response;
  } catch (err) {
    console.log("Error:", err);
    console.log("Status:", err.response.status);
    console.log("Error message:", err.response.data.message);
    console.error("Resend otp error:", err);
    throw err;
  }
};
