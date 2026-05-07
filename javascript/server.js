// importing moduler
import express from 'express';
import path from 'path';
import { Client } from 'pg';
import bcrypt from 'bcrypt';
import authRoutes from './signup/auth.js';

// Server setup
const server = express();
const PORT = 3000;
const __dirname = path.resolve();

const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'food_delivery_db',
  password: '123qwe!"#',
  port: 5432,
});

await db.connect();

// Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname)));

server.use((req, res, next) => {
  req.db = db;
  next();
});

// Use auth routes
server.use(authRoutes); 

// Routes
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

server.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

server.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'register.html'));
});

server.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'menu.html'));
});

server.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'contact.html'));
});

server.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'admin.html'));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});