import express from 'express';

const productRoutes = express.Router();

productRoutes.post('/add-product', async (req, res) => {
    const { name, description, price, image, contains_meat } = req.body;
    const meat = contains_meat === 'on';

    try {
        await req.db.query(
    'INSERT INTO mat_ratter (mat_namn, mat_pris, image_path, contains_meat, description) VALUES ($1, $2, $3, $4, $5)',
        [name, price, image, meat, description]
)       ;
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to add product.');
    }
});

export default productRoutes;