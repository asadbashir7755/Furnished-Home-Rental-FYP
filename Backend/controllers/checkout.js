const Stripe = require('stripe');
const stripe = Stripe(process.env.stripe_secret_key);
const Reservation = require('../models/Reservation');
const BlockedDate = require('../models/BlockedDates');

// reservationData: { propertyId, dates, total, guests, user }
exports.createCheckoutSession = async (req, res) => {
  try {
    console.log("createCheckoutSession called with body:", req.body);

    const { propertyId, dates, total, guests, user } = req.body;
    if (!propertyId || !dates?.startDate || !dates?.endDate) {
      console.error("Missing propertyId or dates in request body");
      return res.status(400).json({ message: "Missing propertyId or dates" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      metadata: {
        propertyId,
        startDate: dates.startDate,
        endDate: dates.endDate,
        guests: guests ? guests.toString() : '',
        user: user ? JSON.stringify(user) : '',
      },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error);
    res.status(500).json({ message: error.message });
  }
};

// Stripe webhook handler
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Stripe webhook received:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { propertyId, startDate, endDate, guests, user } = paymentIntent.metadata || {};
    console.log('💰 PaymentIntent succeeded for property:', propertyId, 'startDate:', startDate, 'endDate:', endDate, 'user:', user);

    try {
      await Reservation.create({
        propertyId,
        dates: { startDate, endDate },
        paymentIntentId: paymentIntent.id,
        status: 'booked',
        guests: guests ? Number(guests) : undefined,
        user: user ? JSON.parse(user) : undefined,
      });
      console.log('✅ Reservation saved to DB');

      await BlockedDate.create({
        propertyId,
        startDate,
        endDate,
      });
      console.log('✅ Dates blocked for property:', propertyId);
    } catch (err) {
      console.error('❌ Error saving reservation or blocking dates:', err);
    }
  }

  res.json({ received: true });
};