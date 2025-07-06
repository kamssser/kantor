// Database configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'admin_panel',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

// API base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';