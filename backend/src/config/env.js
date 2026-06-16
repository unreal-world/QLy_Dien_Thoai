require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DB: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'PhoneShopDB'
  },
  ADMIN: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    fullName: process.env.ADMIN_FULL_NAME || 'System Admin',
    email: process.env.ADMIN_EMAIL || null
  }
};
