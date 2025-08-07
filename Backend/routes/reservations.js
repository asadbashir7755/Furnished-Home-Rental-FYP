const express = require('express');
const router = express.Router();
const checkout = require('../controllers/checkout');
const ListingItem = require('../models/listingitemmodel');
const BlockedDate = require('../models/BlockedDates'); // <-- Add this line

// Stripe checkout session creation route
router.post('/checkout/create-session', checkout.createCheckoutSession);

// Stripe webhook endpoint
router.post('/checkout/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    let event;
    try {
        event = req.body;
        // If you use Stripe's signature verification, do it here
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const propertyId = session.metadata && session.metadata.propertyId;
        const startDate = session.metadata && session.metadata.startDate;
        const endDate = session.metadata && session.metadata.endDate;
        console.log(`[Stripe Webhook] Received checkout.session.completed for propertyId=${propertyId}, startDate=${startDate}, endDate=${endDate}`);
        if (propertyId && startDate && endDate) {
            try {
                const blocked = await BlockedDate.create({
                    propertyId,
                    startDate,
                    endDate
                });
                console.log(`[Stripe Webhook] Blocked dates saved:`, blocked);
            } catch (err) {
                console.error('[Stripe Webhook] Error blocking dates:', err);
            }
        } else {
            console.warn('[Stripe Webhook] Missing propertyId, startDate, or endDate in session metadata');
        }
    }

    res.status(200).send();
});

router.post('/webhook', express.raw({ type: 'application/json' }), checkout.stripeWebhook);

router.post('/test-block', async (req, res) => {
    try {
        const { propertyId, startDate, endDate } = req.body;
        await require('../models/BlockedDates').create({ propertyId, startDate, endDate });
        res.json({ message: 'Blocked date created' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;