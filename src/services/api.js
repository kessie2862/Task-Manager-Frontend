import axios from 'axios';
import { getToken, setToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});
