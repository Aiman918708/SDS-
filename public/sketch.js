// Major Project
// Aiman Fatima Adnan
// 27/04/2026

// Extra for Experts:
// - describe what you did to take this project "above and beyond"

function setup() {
  let container = select('.chart-placeholder');
  if (container) {
    container.html(''); 
    let canvas = createCanvas(700, 350);
    canvas.parent(container);
  }
}

function draw() {
  background(4, 5, 46); // Matches theme #04052e
  
  // 1. Render Background Grid lines
  stroke(34, 0, 124, 100); 
  strokeWeight(1);
  for (let i = 0; i < width; i += 50) line(i, 0, i, height);
  for (let j = 0; j < height; j += 50) line(0, j, width, j);

  // 2. Check if main.js has provided stock data yet
  if (currentStockData) {
    // Set line color dynamically based on stock performance
    if (currentStockData.isPositive) {
      stroke(16, 185, 129); // Green (#10b981)
    } else {
      stroke(239, 68, 68);  // Red (#ef4444)
    }
    strokeWeight(4);
    noFill();

    // Map prices to the canvas height constraints safely
    // (Higher stock price goes up on screen, lower goes down)
    let padding = 50;
    let mapY = (val) => map(val, currentStockData.low, currentStockData.high, height - padding, padding);

    // Points across the timeline: Open -> Low -> High -> Current
    let x1 = 100,  y1 = mapY(currentStockData.open);
    let x2 = 266,  y2 = mapY(currentStockData.low);
    let x3 = 433,  y3 = mapY(currentStockData.high);
    let x4 = 600,  y4 = mapY(currentStockData.current);

    // Draw the dynamic trend line
    beginShape();
    vertex(x1, y1);
    vertex(x2, y2);
    vertex(x3, y3);
    vertex(x4, y4);
    endShape();

    // Draw interactive price indicator dots
    fill(255);
    noStroke();
    ellipse(x1, y1, 6);
    ellipse(x2, y2, 6);
    ellipse(x3, y3, 6);
    ellipse(x4, y4, 8); // Slightly bigger dot for the current price
    
  } else {
    // Fallback UI text if no data is active
    fill(167, 139, 250);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Awaiting stock stream...", width / 2, height / 2);
  }
}