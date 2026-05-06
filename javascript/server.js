// importing moduler
import express from 'express';
import path from 'path';
import { Client } from 'pg';
import bcrypt from 'bcrypt';

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

// Register route
server.post('/register', async (req, res) => {
  const { firstname, lastname, phone, email, address, password } = req.body;


  try {
    // Hash the password before saving

    // Generate a salt and hash the password using bcrypt with a salt rounds of 10


    const salt = await bcrypt.genSalt(10);
  
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      `INSERT INTO users (firstname, lastname, phone, email, address, password)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [firstname, lastname, phone, email, address, hashedPassword]
    );

    res.send('User registered successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Registration failed.');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});