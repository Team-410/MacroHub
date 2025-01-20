import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend-palvelimen osoite
});

export default api;
