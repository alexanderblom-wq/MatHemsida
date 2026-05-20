import express from 'express';

const productRoutes = express.Router();

productRoutes.post('/add-product', async (req, res) => {
    console.log(req.body);
    const { mat_namn, mat_description, mat_pris, mat_image, contains_meat } = req.body;
    const meat = contains_meat === 'on';
    try {
        await req.db.query(
            'INSERT INTO mat_ratter (mat_namn, mat_pris, image_path, contains_meat, description) VALUES ($1, $2, $3, $4, $5)',
            [mat_namn, mat_pris, mat_image, meat, mat_description]
        );
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to add product.');
    }
});

productRoutes.delete('/delete-product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        await req.db.query('DELETE FROM mat_ratter WHERE id = $1', [productId]);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

export default productRoutes;