import express from 'express';

const productRoutes = express.Router();


// ==========================
// LÄGG TILL PRODUKT
// ==========================
productRoutes.post('/add-product', async (req, res) => {

    console.log(req.body);

    // Hämtar produktdata från formuläret
    const { mat_namn, mat_description, mat_pris, mat_image, contains_meat } = req.body;

    // Gör om checkbox-värdet till true/false
    const meat = contains_meat === 'on';

    try {

        // Lägger in produkten i databasen
        await req.db.query(
            'INSERT INTO mat_ratter (mat_namn, mat_pris, image_path, contains_meat, description) VALUES ($1, $2, $3, $4, $5)',
            [mat_namn, mat_pris, mat_image, meat, mat_description]
        );

        // Skickar tillbaka till admin-sidan
        res.redirect('/admin');

    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to add product.');
    }
});


// ==========================
// TA BORT PRODUKT
// ==========================
productRoutes.delete('/delete-product/:id', async (req, res) => {

    // Hämtar produkt-id från URL:en
    const productId = req.params.id;

    try {

        // Tar bort produkten från databasen
        await req.db.query('DELETE FROM mat_ratter WHERE id = $1', [productId]);

        // Skickar success
        res.status(200).json({ message: 'Product deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});


// Exporterar router
export default productRoutes;
