import express from 'express';
import bcrypt from 'bcrypt';

const loginRoutes = express.Router();

// Admin-uppgifter
const ADMIN_USERNAME = 'Alex';
const ADMIN_PASSWORD = 'KevinOtto';


// ==========================
// LOGGA IN
// ==========================
loginRoutes.post('/login', async (req, res) => {

    const ADMIN_USERNAME = process.Alex.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.KevinOtto.ADMIN_PASSWORD;

    // Hämtar email och lösenord från formuläret
    const { email, password } = req.body;

    // Kollar om det är admin som loggar in
    if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.userId = 'admin';
        req.session.isAdmin = true;
        return res.redirect('/admin');
    }

    try {

        // Letar efter användaren i databasen
        const result = await req.db.query('SELECT * FROM users WHERE email = $1', [email]);

        // Om ingen användare hittades
        if (result.rows.length === 0) {
            return res.status(400).send('Invalid email or password.');
        }

        const user = result.rows[0];

        // Jämför lösenordet med det hashade i databasen
        const validPassword = await bcrypt.compare(password, user.password);

        // Om lösenordet inte stämmer
        if (!validPassword) {
            return res.status(400).send('Invalid email or password.');
        }

        // Sparar användarens id i sessionen
        req.session.userId = user.id;

        // Skickar till menyn
        res.redirect('/menu');

    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});


// Exporterar router
export default loginRoutes;
