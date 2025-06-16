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
  connectionString: process.env.DATABASE_URL
});

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
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

async function createUser(userData) {
  try {
    // Generate a unique ID
    const id = crypto.randomUUID();
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    await pool.query(
      'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)',
      [id, userData.name, userData.email, hashedPassword]
    );
    
    return { id, name: userData.name, email: userData.email };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Create test user if not exists
async function initializeDatabase() {
  try {
    await createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

// Initialize database
initializeDatabase();

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
                body += chunk;
              });
              
              req.on('end', async () => {
                try {
                  const { email, password } = JSON.parse(body);
                  if (!email || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                  }

                  // Find user
                  const user = await getUserByEmail(email);
                  if (!user) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid credentials' }));
                    return;
                  }

                  // Verify password
                  const isValidPassword = await bcrypt.compare(password, user.password);
                  if (!isValidPassword) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid credentials' }));
                    return;
                  }

                  // Generate JWT token
                  const token = jwt.sign(
                    { userId: user.id },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '1d' }
                  );

                  // Return user data without password
                  const userData = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at
                  };
                  
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ token, user: userData }));
                } catch (error) {
                  console.error('Login error:', error);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Internal server error' }));
                }
              });
            } catch (error) {
              console.error('Login error:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Internal server error' }));
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
                  if (!name || !email || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                  }

                  // Check if user already exists
                  const existingUser = await getUserByEmail(email);
                  if (existingUser) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'User already exists' }));
                    return;
                  }

                  // Create user
                  await createUser({ name, email, password });
                  
                  // Get the user ID after creation
                  const user = await getUserByEmail(email);
                  if (!user) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                    return;
                  }

                  // Generate JWT token using the actual user ID
                  const token = jwt.sign(
                    { userId: user.id },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '1d' }
                  );

                  // Return user data
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ token, user: { name: user.name, email: user.email } }));
                } catch (error) {
                  console.error('Signup error:', error);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Internal server error' }));
                }
              });
            } catch (error) {
              console.error('Signup error:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Internal server error' }));
            }
            return;
          } else {
            res.writeHead(405);
            res.end('Method Not Allowed');
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
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/auth/signup');
  console.log('- GET /login');
  console.log('- GET /signup');
  console.log('- GET /health');
});