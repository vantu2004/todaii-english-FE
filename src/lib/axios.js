import axios from "axios";

const CLIENT_BASE_URL = "http://localhost:8081/todaii-english/client-side/api/v1";
const SERVER_BASE_URL = "http://localhost:8082/todaii-english/server-side/api/v1";

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



