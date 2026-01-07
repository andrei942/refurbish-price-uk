// ==========================
// Refurbish Price UK - script.js
// ==========================

// 1️⃣ Show/hide custom room name
document.getElementById('roomName').addEventListener('change', function() {
    document.getElementById('customRoomName').style.display =
        this.value === 'Other' ? 'block' : 'none';
});

// 2️⃣ Collect all form data
function collectData() {
    const roomName = document.getElementById('roomName').value === 'Other' 
                     ? document.getElementById('customRoomName').value 
                     : document.getElementById('roomName').value;

    const size = parseFloat(document.getElementById('size').value) || 0;
    const wall = document.getElementById('wallType').value;
    const floor = document.getElementById('flooring').value;

    let optional = [];
    document.querySelectorAll('.optionalItem:checked').forEach(el => {
        optional.push({ 
            name: el.dataset.name, 
            price: parseFloat(el.dataset.price) 
        });
    });

    return { roomName, size, wall, floor, optional };
}

// 3️⃣ Save data to localStorage
function saveData() {
    const data = collectData();
    localStorage.setItem('estimateData', JSON.stringify(data));
}

// 4️⃣ Stripe Checkout button
const stripe = Stripe("YOUR_PUBLISHABLE_KEY"); // Replace with your Stripe publishable key

document.getElementById("checkout-button").addEventListener("click", function() {
    saveData(); // Save data before payment

    fetch("/create-checkout-session", { // Your backend endpoint
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ price: 10 }) // Payment price in GBP
    })
    .then(res => res.json())
    .then(session => stripe.redirectToCheckout({ sessionId: session.id }))
    .catch(err => console.error(err));
});

// 5️⃣ Generate PDF function
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const data = JSON.parse(localStorage.getItem("estimateData"));
    if(!data) {
        alert("No estimate data found! Please fill the form first.");
        return;
    }

    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text("Refurbish Price UK - Estimate", 20, y); y += 10;
    doc.setFontSize(12);

    // Room info
    doc.text(`Room: ${data.roomName} (${data.size} m²)`, 20, y); y += 6;
    doc.text(`Wall: ${data.wall}`, 20, y); y += 6;
    doc.text(`Floor: ${data.floor}`, 20, y); y += 6;

    // Optional items
    let total = 0;
    if(data.optional.length > 0){
        doc.text("Optional Items:", 20, y); y += 6;
        data.optional.forEach(item => {
            doc.text(`${item.name} (£${item.price})`, 20, y);
            total += item.price;
            y += 6;
        });
    }

    // Total estimate
    doc.text(`Total Estimate (materials + labor): £${total}`, 20, y + 10);
    doc.save("Refurbish-Estimate.pdf");
}

// 6️⃣ PDF download button
const pdfButton = document.getElementById("download-pdf");
if(pdfButton){
    pdfButton.addEventListener("click", generatePDF);
}
