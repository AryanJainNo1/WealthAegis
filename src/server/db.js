const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a pool of database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/wealthaegis'
});

// Initialize database
async function initializeDatabase() {
  try {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on email for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email))
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// User operations
async function getUserByEmail(email) {
  try {
    const normalizedEmail = email.toLowerCase();
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

async function createUser(userData) {
  try {
    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, userData.name, userData.email, hashedPassword]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Authentication utilities
async function generateToken(userId) {
  try {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

async function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase,
  getUserByEmail,
  createUser,
  generateToken,
  verifyToken
};
