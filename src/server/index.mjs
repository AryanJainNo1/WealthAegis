import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const path = require('path');
const fs = require('fs');
const http = require('http');
const url = require('url');
const { parse } = require('querystring');

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/wealthaegis',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database initialization
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Check if database is accessible
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created/exists');
    
    // Clear existing test users
    await pool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
    console.log('Deleted test user if existed');
    
    // Create test user
    try {
      await createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Created test user');
    } catch (error) {
      console.error('Error creating test user:', error);
    }
    
    // Verify table contents
    const users = await pool.query('SELECT * FROM users');
    console.log('Current users in database:', users.rows.length);
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Helper function to get content type based on file extension
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.js':
      return 'application/javascript';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

// Database helper functions
async function getUserByEmail(email) {
  try {
    const normalizedEmail = email.toLowerCase();
    console.log('Querying user with normalized email:', normalizedEmail);
    
    // First check if table exists
    const tableCheck = await pool.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')");
    console.log('Table exists:', tableCheck.rows[0].exists);
    
    // List all users for debugging
    const allUsers = await pool.query('SELECT * FROM users');
    console.log('All users in database:', allUsers.rows.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email
    })));
    
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    console.log('Query result:', {
      rowCount: result.rows.length,
      rows: result.rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email
      }))
    });
    
    if (result.rows.length > 0) {
      console.log('Found user:', {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email
      });
    } else {
      console.log('No user found with email:', normalizedEmail);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user:', {
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

async function createUser(userData) {
  try {
    console.log('Creating user:', { name: userData.name, email: userData.email });
    
    // Generate a unique ID
    const id = crypto.randomUUID();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    console.log('Password hashed successfully');
    
    // First check if user exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      console.error('User already exists in database:', existingUser.email);
      throw new Error('User already exists');
    }
    
    // Insert new user
    await pool.query(
      'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)',
      [id, userData.name, userData.email, hashedPassword]
    );
    
    // Verify user was created
    const createdUser = await getUserByEmail(userData.email);
    if (!createdUser) {
      console.error('Failed to verify user creation');
      throw new Error('Failed to verify user creation');
    }
    
    console.log('User created successfully and verified');
    return { id, name: userData.name, email: userData.email };
  } catch (error) {
    console.error('Error creating user:', {
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

// Initialize database before starting server
await initializeDatabase();

// Create server
const server = http.createServer(async (req, res) => {
  try {
    // Parse URL
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname || '';
    
    // Handle static files first
    const filePath = path.join(__dirname, '../../dist', pathname === '/' ? 'index.html' : pathname);
    if (fs.existsSync(filePath)) {
      const contentType = getContentType(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // Handle API routes
    if (pathname.startsWith('/api/auth/')) {
      const apiPath = pathname.substring(9); // Remove '/api/auth/' prefix
      switch (apiPath) {
        case '/login':
          if (req.method === 'POST') {
            try {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const { email, password } = JSON.parse(body);
                  if (!email || !password) {
                    throw new Error('Email and password are required');
                  }
                  
                  console.log('Login attempt:', { email });
                  const user = await getUserByEmail(email);
                  
                  if (!user) {
                    throw new Error('Invalid credentials');
                  }
                  
                  const validPassword = await bcrypt.compare(password, user.password);
                  if (!validPassword) {
                    throw new Error('Invalid credentials');
                  }
                  
                  const token = jwt.sign(
                    { userId: user.id },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '24h' }
                  );
                  
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    success: true,
                    data: {
                      token,
                      user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                      }
                    }
                  }));
                } catch (error) {
                  console.error('Login error:', error);
                  res.writeHead(401, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    success: false,
                    error: error.message || 'Invalid credentials'
                  }));
                }
              });
            } catch (error) {
              console.error('Login request error:', error);
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                error: 'Invalid request format'
              }));
            }
            return;
          } else {
            res.writeHead(405);
            res.end('Method Not Allowed');
            return;
          }

        case '/signup':
          if (req.method === 'POST') {
            try {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              
              req.on('end', async () => {
                try {
                  const { name, email, password } = JSON.parse(body);
                  console.log('Signup request received:', { name, email });
                  
                  if (!name || !email || !password) {
                    console.error('Missing required fields');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                  }

                  // Check if user already exists
                  const existingUser = await getUserByEmail(email);
                  if (existingUser) {
                    console.log('User already exists:', email);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'User already exists' }));
                    return;
                  }

                  // Create user
                  const user = await createUser({ name, email, password });
                  console.log('User created successfully:', user);
                  
                  // Generate JWT token
                  const token = jwt.sign(
                    { userId: user.id },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '1d' }
                  );
                  console.log('JWT token generated successfully');

                  // Return success response
                  res.writeHead(201, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ 
                    token, 
                    user: { 
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      created_at: new Date().toISOString() 
                    } 
                  }));
                } catch (error) {
                  console.error('Signup error:', error);
                  const errorMessage = error instanceof Error ? error.message : 'Internal server error';
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: errorMessage }));
                }
              });
            } catch (error) {
              console.error('Signup error:', error);
              const errorMessage = error instanceof Error ? error.message : 'Internal server error';
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: errorMessage }));
            }
            return;
          } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            return;
          }

        case '/health':
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'healthy' }));
          break;

        default:
          res.writeHead(404);
          res.end('Not Found');
          break;
      }
    }

    // Handle page routes
    const pageRoutes = ['/login', '/signup', '/health'];
    if (pageRoutes.includes(pathname)) {
      if (req.method === 'GET') {
        // Serve the appropriate page
        const indexPath = path.join(__dirname, '../../dist/index.html');
        if (fs.existsSync(indexPath)) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          fs.createReadStream(indexPath).pipe(res);
          return;
        }
      } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
        return;
      }
    }

    // Handle static files
    const staticFilePath = path.join(__dirname, '../../dist', pathname);
    if (fs.existsSync(staticFilePath)) {
      const contentType = getContentType(staticFilePath);
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(staticFilePath).pipe(res);
      return;
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  } catch (error) {
    console.error('Request error:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

// Start server
const PORT = process.env.PORT || 3001;

// Handle CORS
server.on('listening', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/auth/signup');
  console.log('- GET /login');
  console.log('- GET /signup');
  console.log('- GET /health');
});