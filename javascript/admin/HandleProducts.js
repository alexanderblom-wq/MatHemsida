import express from 'express';

const productRoutes = express.Router();

productRoutes.post('/add-product', async (req, res) => {
    const { name, description, price, image, containsMeat } = req.body;
    const contains_meat = containsMeat === 'true';

    try {
        await req.db.query(
            'INSERT INTO products (name, price, image, contains_meat, description) VALUES ($1, $2, $3, $4, $5)',
            [name, price, image, contains_meat, description]
        );
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to add product.');
    }
});

export default productRoutes;