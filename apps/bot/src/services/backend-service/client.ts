import axios from 'axios';

export const client = axios.create({
  baseURL: process.env.BACKEND_INTERNAL_URL,
  timeout: 5000,
  headers: { Authorization: `Bearer ${process.env.INTERNAL_BOT_TOKEN}` },
});
