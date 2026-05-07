import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { firstname, lastname, phone, email, address, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await req.db.query(
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

export default router;