const materialData = {
  "tile_floor": { material: 30, labour: 50, name: "Tile Floor" },
  "wood_floor": { material: 45, labour: 40, name: "Wood Floor" },
  "laminate_floor": { material: 25, labour: 30, name: "Laminate Floor" },
  "vinyl_floor": { material: 20, labour: 25, name: "Vinyl Floor" },
  "paint_wall": { material: 8, labour: 15, name: "Paint Walls" },
  "wallpaper": { material: 18, labour: 25, name: "Wallpaper" },
  "wall_tile": { material: 25, labour: 40, name: "Wall Tile" },
  "paint_ceiling": { material: 6, labour: 10, name: "Paint Ceiling" },
  "door": { material: 120, labour: 60, name: "Door (per unit)" },
  "window": { material: 200, labour: 80, name: "Window (per unit)" }
};

// Stripe publishable key
const stripe = Stripe("YOUR_PUBLISHABLE_KEY_HERE");

document.getElementById("estimateBtn").addEventListener("click", async function() {
  const room = document.getElementById("room").value;
  const size = Number(document.getElementById("size").value);
  const materialsSelect = document.getElementById("materials");
  const selectedMaterials = Array.from(materialsSelect.selectedOptions).map(opt => opt.value);

  if (!size || size <= 0) return alert("Enter room size");
  if (selectedMaterials.length === 0) return alert("Select at least one material");

  // Save selections for success page
  localStorage.setItem("estimateData", JSON.stringify({
    room, size, materials: selectedMaterials
  }));

  let grandTotal = 0;
  selectedMaterials.forEach(mat => {
    const data = materialData[mat];
    grandTotal += (data.material + data.labour) * size;
  });

  const amount = Math.round(grandTotal * 100);

  const res = await fetch("https://YOUR_SERVER_URL/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });

  const session = await res.json();
  stripe.redirectToCheckout({ sessionId: session.id });
});
