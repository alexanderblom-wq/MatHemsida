// importing moduler
import express from 'express';
import path from 'path';

// Server setup
const server = express();
const PORT = 3000;
const __dirname = path.resolve();

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

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});