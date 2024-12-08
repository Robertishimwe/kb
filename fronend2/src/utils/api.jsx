import axios from "axios";

const headers = {};

export default axios.create({  
  baseURL: "https://quixy-backend.ishimwe.rw",
  headers,
});