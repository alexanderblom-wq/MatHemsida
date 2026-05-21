import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();


// ==========================
// REGISTRERA ANVÄNDARE
// ==========================
router.post('/register', async (req, res) => {

    // Hämtar alla fält från formuläret
    const { firstname, lastname, phone, email, address, password } = req.body;

    try {

        // Skapar salt och hashar lösenordet
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lägger in användaren i databasen
        await req.db.query(
            `INSERT INTO users (firstname, lastname, phone, email, address, password)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [firstname, lastname, phone, email, address, hashedPassword]
        );

        // Skickar success-meddelande
        res.send('User registered successfully!');

    } catch (err) {
        console.error(err);
        res.status(500).send('Registration failed.');
    }
});


// Exporterar router
export default router;
