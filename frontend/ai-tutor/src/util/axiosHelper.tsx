import axios from 'axios';

const backendApi = axios.create({
  baseURL: process.env.BACKEND_URL, // Use the environment variable
  headers: {
    'Content-Type': 'application/json',
  },
});

export default backendApi;
