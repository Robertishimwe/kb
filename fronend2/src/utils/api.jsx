import axios from "axios";

const headers = {};

export default axios.create({  
  baseURL: "https://kb-3.onrender.com",
  headers,
});