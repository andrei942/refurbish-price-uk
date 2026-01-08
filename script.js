function calculateEstimate() {
  const size = Number(document.getElementById("size").value);
  const material = document.getElementById("material").value;

  if (!size || size <= 0) {
    alert("Please enter room size");
    return;
  }

  let materialCostPerM2 = 0;
  let labourCostPerM2 = 0;

  switch(material) {
    // Floors
    case "tile_floor":
      materialCostPerM2 = 30;
      labourCostPerM2 = 50;
      break;
    case "wood_floor":
      materialCostPerM2 = 45;
      labourCostPerM2 = 40;
      break;
    case "laminate_floor":
      materialCostPerM2 = 25;
      labourCostPerM2 = 30;
      break;
    case "vinyl_floor":
      materialCostPerM2 = 20;
      labourCostPerM2 = 25;
      break;
    
    // Walls
    case "paint_wall":
      materialCostPerM2 = 8;
      labourCostPerM2 = 15;
      break;
    case "wallpaper":
      materialCostPerM2 = 18;
      labourCostPerM2 = 25;
      break;
    case "wall_tile":
      materialCostPerM2 = 25;
      labourCostPerM2 = 40;
      break;

    // Ceiling
    case "paint_ceiling":
      materialCostPerM2 = 6;
      labourCostPerM2 = 10;
      break;

    // Doors / Windows per unit
    case "door":
      materialCostPerM2 = 120; // per door
      labourCostPerM2 = 60;
      break;
    case "window":
      materialCostPerM2 = 200; // per window
      labourCostPerM2 = 80;
      break;

    default:
      materialCostPerM2 = 0;
      labourCostPerM2 = 0;
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
