const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { DB } = require('./env');

const isProduction = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
  host: DB.host,
  port: DB.port,
  user: DB.user,
  password: DB.password,
  database: DB.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(isProduction && {
    ssl: { rejectUnauthorized: false }
  })
});

const ensureImagePositionColumn = async () => {
  const [columns] = await pool.query(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Image' AND COLUMN_NAME = 'imagePosition'`,
    [DB.database]
  );

  if (columns.length === 0) {
    await pool.query('ALTER TABLE Image ADD COLUMN imagePosition INT NOT NULL DEFAULT 0 AFTER imageSource');
    console.log('Added Image.imagePosition column for ordered product images.');
  }
};

// Setup and auto-initialize database schema on startup
const setupTables = async () => {
  try {
    let tablesExist = false;
    let databaseExists = true;
    
    // 1. Try querying the 'Product' table to see if it already exists
    try {
      const tempConn = await mysql.createConnection({
        host: DB.host,
        port: DB.port,
        user: DB.user,
        password: DB.password,
        database: DB.database,
        ...(isProduction && {
          ssl: { rejectUnauthorized: false }
        })
      });
      await tempConn.query('SELECT 1 FROM Product LIMIT 1');
      await tempConn.end();
      tablesExist = true;
    } catch (err) {
      tablesExist = false;
      // Check if the database itself does not exist
      if (err.code === 'ER_BAD_DB_ERROR' || err.errno === 1049) {
        databaseExists = false;
      }
    }

    // 2. If the database does not exist (typically local environment), create it first
    if (!databaseExists && !isProduction) {
      console.log(`Database '${DB.database}' does not exist. Creating it first...`);
      const adminConn = await mysql.createConnection({
        host: DB.host,
        port: DB.port,
        user: DB.user,
        password: DB.password,
        ...(isProduction && {
          ssl: { rejectUnauthorized: false }
        })
      });
      await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB.database}\``);
      await adminConn.end();
      console.log(`Database '${DB.database}' created successfully.`);
    }

    // 3. If tables do not exist, run the database.sql script
    if (!tablesExist) {
      console.log('Product table does not exist. Initializing schema from database.sql...');
      
      const connection = await mysql.createConnection({
        host: DB.host,
        port: DB.port,
        user: DB.user,
        password: DB.password,
        database: DB.database,
        multipleStatements: true,
        ...(isProduction && {
          ssl: { rejectUnauthorized: false }
        })
      });
      
      const sqlPath = path.join(__dirname, '../../../database.sql');
      if (fs.existsSync(sqlPath)) {
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        await connection.query(sqlContent);
        console.log('Database and all tables initialized successfully!');
      } else {
        console.warn('database.sql file was not found at: ' + sqlPath);
      }
      
      await connection.end();
    } else {
      console.log('Database and tables already exist. Skipping schema initialization.');
    }

    await ensureImagePositionColumn();
  } catch (err) {
    console.error('Error during database auto-initialization:', err.message);
  }
};

// Execute initialization
setupTables();

module.exports = pool;


