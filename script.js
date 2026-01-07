// Show custom room input
document.getElementById('roomName').addEventListener('change', function() {
  document.getElementById('customRoomName').style.display =
      this.value === 'Other' ? 'block' : 'none';
});

// Stripe setup (publishable key)
const stripe = Stripe('pk_live_51Sn2002K6oA46zDCbC6ODNqsrcezcruvdzJJDtzWhY4CXu1t1KM0C2H2M0wh7ahrBg2SeaPJC5mdKkqQSLsYN1Sh00MditgrNv');

// Save form data
function saveData() {
    const data = {
        roomName: document.getElementById('roomName').value,
        size: document.getElementById('size').value,
        wall: document.getElementById('wallType').value,
        floor: document.getElementById('flooring').value,
        optional: Array.from(document.querySelectorAll('.optionalItem:checked')).map(el => ({
            name: el.dataset.name,
            price: el.dataset.price
        }))
    };
    localStorage.setItem('estimateData', JSON.stringify(data));
}

// Stripe checkout button
const checkoutButton = document.getElementById('checkout-button');
if(checkoutButton){
    checkoutButton.addEventListener('click', async function() {
        saveData();
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        });
        const session = await response.json();
        stripe.redirectToCheckout({ sessionId: session.id });
    });
}

// PDF generation
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const data = JSON.parse(localStorage.getItem('estimateData'));
    if(!data){ alert('No data found!'); return; }

    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18); doc.text('Refurbish Price UK - Estimate', 20, y); y+=10;
    doc.setFontSize(12);
    doc.text(`Room: ${data.roomName}`, 20, y); y+=6;
    doc.text(`Size: ${data.size} m²`, 20, y); y+=6;
    doc.text(`Wall: ${data.wall}`, 20, y); y+=6;
    doc.text(`Floor: ${data.floor}`, 20, y); y+=6;
    if(data.optional.length > 0){
        doc.text('Optional Items:', 20, y); y+=6;
        data.optional.forEach(item => {
            doc.text(`${item.name} (£${item.price})`, 20, y); y+=6;
        });
    }
    doc.save('Refurbish-Estimate.pdf');
}
