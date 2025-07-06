// Database configuration untuk hosting
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost', // Cek lagi di cPanel/dokumen hosting Anda
  user: process.env.DB_USER || 'karnssset_hfmedia',
  password: process.env.DB_PASSWORD || 'i=#6[T57v)4]RgRk', // <-- GANTI INI
  database: process.env.DB_NAME || 'karnssset_hfmedia',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

// API base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';