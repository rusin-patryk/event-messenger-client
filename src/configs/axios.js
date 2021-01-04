import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 10000000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
  },
});
export default instance;
