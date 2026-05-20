import express from 'express';
import bcrypt from 'bcrypt';

// Server setup
const loginRoutes = express.Router();

loginRoutes.post('/login', async (req, res) => {
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const { email, password } = req.body;
  if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.userId  = 'admin';
    req.session.isAdmin = true;
    return res.redirect('/admin');
}
    try {
        const result = await req.db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).send('Invalid email or password.');
        }
        const user = result.rows[0];

        // Compare the provided password with the hashed password in the database
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(400).send('Invalid email or password.');
        }

        req.session.userId = user.id;

        res.redirect('/menu');
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});

export default loginRoutes;