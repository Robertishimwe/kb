import axios from "axios";

const headers = {
    "Access-Control-Allow-Origin": "https://jubilant-disco-7x45v6vgq973rj9q-5173.app.github.dev"
};

export default axios.create({  
  baseURL: "https://kb-3.onrender.com",
  headers,
});