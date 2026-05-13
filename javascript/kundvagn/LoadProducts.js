import express from 'express';
const router = express.Router();

router.get('/api/products', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM mat_ratter');
        const products = result.rows;
        res.json(products); // Skickar datan som JSON till frontend
    } catch (error) {
        console.error('Fel vid hämtning av produkter:', error);
        res.status(500).json({ error: 'Kunde inte hämta produkter' });
    }
});

export default router;