import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();


// ==========================
// REGISTRERA ANVÄNDARE
// ==========================
router.post('/register', async (req, res) => {

    // Hämtar alla fält från formuläret
    // Gör email till lowercase så det alltid sparas likadant
    const { firstname, lastname, phone, address, password } = req.body;
    const email = req.body.email.toLowerCase();

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

        // Skickar användare till menyn
        res.redirect('/login');

    } catch (err) {
        console.error(err);
        res.status(500).send('Registration failed.');
    }
});


// Exporterar router
export default router;
