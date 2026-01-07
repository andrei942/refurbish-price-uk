const express = require('express');
const app = express();
const stripe = require('stripe')('YOUR_SECRET_KEY'); // <-- Replace with your Stripe secret key

app.use(express.json());
app.use(express.static('./')); // serve all files in root

// Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: { name: 'Refurbish PDF Estimate' },
          unit_amount: 1000 // £10
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/success.html',  // change if live URL
      cancel_url: 'http://localhost:3000/index.html'
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
