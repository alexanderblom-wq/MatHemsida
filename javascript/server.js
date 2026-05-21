// ==========================
// IMPORTS
// ==========================
import express from 'express';
import path from 'path';
import { Client } from 'pg';
import bcrypt from 'bcrypt';
import session from 'express-session';

// Importerar routes
import authRoutes from './signup/auth.js';
import loginRoutes from './login/login.js';
import productRoutes from './admin/HandleProducts.js';
import loadProducts from './kundvagn/LoadProducts.js';
import cartRoutes from './kundvagn/cart.js';


// ==========================
// MIDDLEWARE-FUNKTIONER
// ==========================

// Kollar om användaren är inloggad
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

// Kollar om användaren är admin
function requireAdmin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    // Måste ha isAdmin = true i sessionen
    if (req.session.isAdmin !== true) {
        return res.status(403).send('Åtkomst nekad – du är inte admin.');
    }

    next();
}


// ==========================
// SERVER SETUP
// ==========================
const server = express();
const PORT = 3000;
const __dirname = path.resolve();

// Databasanslutning
const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'food_delivery_db',
    password: '123qwe!"#',
    port: 5432,
});

await db.connect();


// ==========================
// MIDDLEWARE
// ==========================

// Gör så servern kan läsa formulärdata och JSON
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Serverar statiska filer (css, bilder, etc)
server.use(express.static(path.join(__dirname)));

// Session-hantering för inloggning
server.use(session({
    secret: 'hddjduuawjdjuuddhsadhjdaeuusfhifdjfkj',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Gör databasen tillgänglig i alla routes
server.use((req, res, next) => {
    req.db = db;
    next();
});

// Använder alla routes
server.use(authRoutes);
server.use(loginRoutes);
server.use(productRoutes);
server.use(loadProducts);
server.use(cartRoutes);


// ==========================
// SIDROUTES
// ==========================

// Logga ut som rensar sessionen
server.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/index');
});

server.get('/productadd', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'productadd.html'));
});

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

server.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

server.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'register.html'));
});

server.get('/menu', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'menu.html'));
});

server.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'contact.html'));
});  


// Kräver inloggning
server.get('/admin',requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'admin.html'));
});

server.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Kräver inloggning
server.get('/kart', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'kart.html'));
});

// Kräver inloggning
server.get('/betala', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'betala.html'));
});

server.get('/productadd', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'productadd.html'));
});



// ==========================
// STARTA SERVERN
// ==========================
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
