import express from 'express';
const router = express.Router();

// Get cart
router.get('/api/cart', (req, res) => {
    res.json(req.session.cart || []);
});

// Add item to cart
router.post('/api/cart/add', (req, res) => {
    const { id, name, price, image } = req.body;
    if (!req.session.cart) req.session.cart = [];
    
    const existing = req.session.cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        req.session.cart.push({ id, name, price, image, quantity: 1 });
    }
    res.json({ success: true, cart: req.session.cart });
});

// Remove item
router.post('/api/cart/remove', (req, res) => {
    const { id } = req.body;
    if (!req.session.cart) return res.json({ success: true });
    req.session.cart = req.session.cart.filter(item => item.id !== id);
    res.json({ success: true, cart: req.session.cart });
});

router.post('/api/cart/update', (req, res) => {
    const { id, quantity } = req.body;
    if (!req.session.cart) return res.json({ success: true });
    
    const item = req.session.cart.find(item => item.id === id);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            req.session.cart = req.session.cart.filter(i => i.id !== id);
        }
    }
    res.json({ success: true, cart: req.session.cart });
});

export default router;