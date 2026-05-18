import express from 'express';
const router = express.Router();


router.get('/menu', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM mat_ratter');
        const products = result.rows;
        // create div for each product and append to menu
        
        


    } catch (error) {
        console.error('Fel vid hämtning av produkter:', error);
        res.status(500).json({ error: 'Kunde inte hämta produkter' });
    }
});

export default router;