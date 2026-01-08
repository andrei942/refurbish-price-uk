function calculateEstimate() {
  const size = Number(document.getElementById("size").value);
  const material = document.getElementById("material").value;

  if (!size || size <= 0) {
    alert("Please enter room size");
    return;
  }

  let materialCostPerM2 = 0;
  let labourCostPerM2 = 0;

  if (material === "tile") {
    materialCostPerM2 = 30;
    labourCostPerM2 = 50;
  }

  if (material === "wood") {
    materialCostPerM2 = 45;
    labourCostPerM2 = 40;
  }

  if (material === "laminate") {
    materialCostPerM2 = 25;
    labourCostPerM2 = 30;
  }

  if (material === "vinyl") {
    materialCostPerM2 = 20;
    labourCostPerM2 = 25;
  }

  if (material === "paint") {
    materialCostPerM2 = 8;
    labourCostPerM2 = 15;
  }

  if (material === "wallpaper") {
    materialCostPerM2 = 18;
    labourCostPerM2 = 25;
  }

  const materialTotal = size * materialCostPerM2;
  const labourTotal = size * labourCostPerM2;
  const grandTotal = materialTotal + labourTotal;

  document.getElementById("result").innerHTML = `
    <strong>Material cost:</strong> £${materialTotal.toLocaleString()}<br>
    <strong>Labour cost:</strong> £${labourTotal.toLocaleString()}<br><br>
    <strong>Total estimate:</strong> £${grandTotal.toLocaleString()}
  `;
}
