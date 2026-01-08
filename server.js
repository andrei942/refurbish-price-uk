const express = require('express');
const app = express();
const stripe = require('stripe')('YOUR_SECRET_KEY_HERE'); // <-- Your Stripe Secret Key
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { amount } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: { name: 'Refurbishment Estimate' },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://your-site.com/success.html',
    cancel_url: 'https://your-site.com/cancel.html',
  });
  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Server running on port 4242'));
