import express from 'express';

const router = express.Router();


// ==========================
// HÄMTA ALLA PRODUKTER
// ==========================
router.get('/api/products', async (req, res) => {

    try {

        // Hämtar alla rätter från databasen
        const result = await req.db.query('SELECT * FROM mat_ratter');
        const products = result.rows;

        // Skickar tillbaka produkterna som JSON
        res.json(products);

    } catch (error) {

        // Loggar felet och skickar felmeddelande
        console.error('Fel vid hämtning av produkter:', error);
        res.status(500).json({ error: 'Kunde inte hämta produkter' });
    }
});


// Exporterar router
export default router;
