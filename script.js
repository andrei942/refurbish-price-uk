// ===== SHOW CUSTOM ROOM FIELD =====
document.getElementById('roomName').addEventListener('change', function() {
    document.getElementById('customRoomName').style.display =
        this.value === 'Other' ? 'block' : 'none';
});

// ===== COLLECT FORM DATA =====
function collectData() {
    const roomName = document.getElementById('roomName').value === 'Other'
        ? document.getElementById('customRoomName').value
        : document.getElementById('roomName').value;

    const size = parseFloat(document.getElementById('size').value) || 0;
    const wall = document.getElementById('wallType').value;
    const floor = document.getElementById('flooring').value;

    let optional = [];
    document.querySelectorAll('.optionalItem:checked').forEach(el => {
        optional.push({ name: el.dataset.name, price: parseFloat(el.dataset.price) });
    });

    return { roomName, size, wall, floor, optional };
}

// ===== SAVE DATA =====
function saveData() {
    const data = collectData();
    localStorage.setItem('estimateData', JSON.stringify(data));
}

// ===== STRIPE CHECKOUT =====
const stripe = Stripe('pk_live_51Sn2002K6oA46zDCbC6ODNqsrcezcruvdzJJDtzWhY4CXu1t1KM0C2H2M0wh7ahrBg2SeaPJC5mdKkqQSLsYN1Sh00MditgrNv');

document.getElementById("checkout-button").addEventListener("click", function() {
    saveData();
    fetch("/create-checkout-session", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" } 
    })
    .then(res => res.json())
    .then(session => stripe.redirectToCheckout({ sessionId: session.id }))
    .catch(err => console.error(err));
});

// ===== PDF GENERATOR (success.html) =====
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const data = JSON.parse(localStorage.getItem("estimateData"));
    if(!data){ alert("No data available!"); return; }

    const doc = new jsPDF();
    let y=20;
    doc.setFontSize(18); doc.text("Refurbish Price UK - Estimate", 20, y); y+=10;
    doc.setFontSize(12);
    doc.text(`Room: ${data.roomName} (${data.size} m²)`, 20, y); y+=6;
    doc.text(`Wall: ${data.wall}`, 20, y); y+=6;
    doc.text(`Floor: ${data.floor}`, 20, y); y+=6;
    let total = 0;
    if(data.optional.length > 0){
        doc.text("Optional Items:", 20, y); y+=6;
        data.optional.forEach(item => {
            doc.text(`${item.name} (£${item.price})`, 20, y);
            total += item.price; y+=6;
        });
    }
    doc.text(`Total Estimate (materials + labor): £${total}`, 20, y+10);
    doc.save("Refurbish-Estimate.pdf");
} 
