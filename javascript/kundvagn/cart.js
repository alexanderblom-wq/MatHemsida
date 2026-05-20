import express from 'express';
const router = express.Router();

// Hämta kart
router.get('/api/cart', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.json([]);

    const result = await req.db.query(`
        SELECT c.id, c.quantity, m.mat_namn AS name, m.mat_pris AS price, m.image_path AS image
        FROM cart c
        JOIN mat_ratter m ON c.product_id = m.id
        WHERE c.user_id = $1
    `, [userId]);

    res.json(result.rows);
});

// Lägg till i kart
router.post('/api/cart/add', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Inte inloggad' });

    const { id, quantity = 1 } = req.body;

    const existing = await req.db.query(
        'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
        [userId, id]
    );

    if (existing.rows.length > 0) {
        await req.db.query(
            'UPDATE cart SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2',
            [userId, id]
        );
    } else {
        await req.db.query(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
            [userId, id, quantity]
        );
    }

    res.json({ success: true });
});

// Uppdatera antal
router.post('/api/cart/update', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Inte inloggad' });

    const { id, quantity } = req.body;

    if (quantity <= 0) {
        await req.db.query(
            'DELETE FROM cart WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
    } else {
        await req.db.query(
            'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3',
            [quantity, id, userId]
        );
    }

    res.json({ success: true });
});

// Ta bort item
router.post('/api/cart/remove', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Inte inloggad' });

    const { id } = req.body;
    await req.db.query(
        'DELETE FROM cart WHERE id = $1 AND user_id = $2',
        [id, userId]
    );

    res.json({ success: true });
});

// Töm kart efter beställning
router.post('/api/cart/clear', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Inte inloggad' });

    await req.db.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    res.json({ success: true });
});

export default router;