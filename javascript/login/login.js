import express from 'express';
import bcrypt from 'bcrypt';

const loginRoutes = express.Router();


// ==========================
// LOGGA IN
// ==========================
loginRoutes.post('/login', async (req, res) => {

    // Hämtar email och lösenord från formuläret
    // Gör email till lowercase så jämförelsen fungerar oavsett stora/små bokstäver
    const { password } = req.body;
    const email = req.body.email.toLowerCase();

    try {

        // Letar efter användaren i databasen
        // LOWER() gör så databasens email också blir lowercase
        const result = await req.db.query('SELECT * FROM users WHERE LOWER(email) = $1', [email]);

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

        // Kollar om användaren är admin i databasen
        if (user.is_admin) {
            req.session.isAdmin = true;
            return res.redirect('/admin');
        }

        // Vanlig användare skickas till menyn
        res.redirect('/menu');

    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});


// Exporterar router
export default loginRoutes;
