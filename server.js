const express = require('express');
const app = express();
const stripe = require('stripe')('pk_live_51Sn2002K6oA46zDCbC6ODNqsrcezcruvdzJJDtzWhY4CXu1t1KM0C2H2M0wh7ahrBg2SeaPJC5mdKkqQSLsYN1Sh00MditgrNv'); // <-- Your Stripe Secret Key
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
    success_url: 'https://refurbish-price-uk.onrender.com/',
    cancel_url: 'https://refurbish-price-uk.onrender.com/',
  });
  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Server running on port 4242'));
