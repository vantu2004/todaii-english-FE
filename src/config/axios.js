import axios from "axios";

const CLIENT_BASE_URL = import.meta.env.VITE_CLIENT_BASE_URL;
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const clientInstance = axios.create({
  baseURL: CLIENT_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const serverInstance = axios.create({
  baseURL: SERVER_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
