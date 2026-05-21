import express from 'express';

const router = express.Router();


// ==========================
// HÄMTA KUNDVAGN
// ==========================
router.get('/api/cart', async (req, res) => {

    // Hämtar userId från sessionen
    const userId = req.session.userId;

    // Om användaren inte är inloggad
    // skicka tillbaka tom array
    if (!userId) return res.json([]);

    // Hämtar alla produkter från kundvagnen
    // c = cart-tabellen
    // m = mat_ratter-tabellen
    const result = await req.db.query(`
        
        SELECT 
            c.id,
            c.quantity,
            m.mat_namn AS name,
            m.mat_pris AS price,
            m.image_path AS image,
            m.contains_meat

        FROM cart c

        JOIN mat_ratter m 
        ON c.product_id = m.id

        WHERE c.user_id = $1

    `, [userId]);

    // Skickar tillbaka produkterna som JSON
    res.json(result.rows);
});


// ==========================
// LÄGG TILL I KUNDVAGN
// ==========================
router.post('/api/cart/add', async (req, res) => {

    // Hämtar userId från session
    const userId = req.session.userId;

    // Om användaren inte är inloggad
    if (!userId) {
        return res.status(401).json({
            error: 'Inte inloggad'
        });
    }

    // Hämtar produkt-id och quantity från frontend
    // quantity blir automatiskt 1 om inget skickas
    const { id, quantity = 1 } = req.body;

    // Kollar om produkten redan finns i kundvagnen
    const existing = await req.db.query(
        `
        SELECT * 
        FROM cart 
        WHERE user_id = $1 
        AND product_id = $2
        `,
        [userId, id]
    );

    // Om produkten redan finns
    if (existing.rows.length > 0) {

        // Öka quantity med +1
        await req.db.query(
            `
            UPDATE cart 
            SET quantity = quantity + 1 
            WHERE user_id = $1 
            AND product_id = $2
            `,
            [userId, id]
        );

    } else {

        // Om produkten inte finns
        // skapa ny rad i databasen
        await req.db.query(
            `
            INSERT INTO cart (
                user_id,
                product_id,
                quantity
            )
            VALUES ($1, $2, $3)
            `,
            [userId, id, quantity]
        );
    }

    // Skickar success till frontend
    res.json({ success: true });
});


// ==========================
// UPPDATERA ANTAL
// ==========================
router.post('/api/cart/update', async (req, res) => {

    // Hämtar userId från session
    const userId = req.session.userId;

    // Om inte inloggad
    if (!userId) {
        return res.status(401).json({
            error: 'Inte inloggad'
        });
    }

    // Hämtar cart-id och nytt quantity
    const { id, quantity } = req.body;

    // Om quantity är 0 eller mindre
    // ta bort produkten
    if (quantity <= 0) {

        await req.db.query(
            `
            DELETE FROM cart 
            WHERE id = $1 
            AND user_id = $2
            `,
            [id, userId]
        );

    } else {

        // Annars uppdatera quantity
        await req.db.query(
            `
            UPDATE cart 
            SET quantity = $1 
            WHERE id = $2 
            AND user_id = $3
            `,
            [quantity, id, userId]
        );
    }

    // Success response
    res.json({ success: true });
});


// ==========================
// TA BORT PRODUKT
// ==========================
router.post('/api/cart/remove', async (req, res) => {

    // Hämtar userId från session
    const userId = req.session.userId;

    // Om inte inloggad
    if (!userId) {
        return res.status(401).json({
            error: 'Inte inloggad'
        });
    }

    // Hämtar cart-id från frontend
    const { id } = req.body;

    // Tar bort produkten från kundvagnen
    await req.db.query(
        `
        DELETE FROM cart 
        WHERE id = $1 
        AND user_id = $2
        `,
        [id, userId]
    );

    // Success response
    res.json({ success: true });
});


// ==========================
// TÖM HELA KUNDVAGNEN
// ==========================
router.post('/api/cart/clear', async (req, res) => {

    // Hämtar userId från session
    const userId = req.session.userId;

    // Om inte inloggad
    if (!userId) {
        return res.status(401).json({
            error: 'Inte inloggad'
        });
    }

    // Tar bort alla produkter
    // som tillhör användaren
    await req.db.query(
        `
        DELETE FROM cart 
        WHERE user_id = $1
        `,
        [userId]
    );

    // Success response
    res.json({ success: true });
});


// Exporterar router
export default router;