// Displays data provided by main.js
async function loadTickerTape() {
  try {
    const response = await fetch('/api/tickers'); 
    const data = await response.json();

    let html = '';
    data.forEach(stock => {
      let symbol = stock["01. symbol"] || "N/A";
      let change = stock["10. change percent"] || "0.00%";
      
      html += `${symbol} ${change} &nbsp;&bull;&nbsp; `;
    });

    let tapeElement = select('#tickerTape');
    if (tapeElement) {
      tapeElement.html(html);
    }
  } 
  catch (error) {
    console.error("Connection error:", error);
    let tapeElement = select('#tickerTape');
    if (tapeElement) {
      tapeElement.html("Error connecting to backend");
    }
  }
}

function setup() {
  let container = select('.chart-placeholder');
  if (container) {
    container.html('');
    let canvas = createCanvas(700, 350);
    canvas.parent(container);
  }
  loadTickerTape(); 
}

function draw() {
  console.log(currentStockData);
  background(4, 5, 46);

  // Grid
  stroke(34, 0, 124, 100);
  strokeWeight(1);

  for (let i = 0; i < width; i += 50) {
    line(i, 0, i, height);
  }
  for (let j = 0; j < height; j += 50) {
    line(0, j, width, j);
  }

  // Draw graph if data exists
  if (currentStockData) {

    stroke(currentStockData.isPositive ? color(16,185,129) : color(239,68,68));
    strokeWeight(3);
    noFill();

    const padding = 40;

    function mapY(value){
      return map(
        value,
        currentStockData.low,
        currentStockData.high,
        height-padding,
        padding
      );
    }

    const x1 = 80;
    const x2 = 250;
    const x3 = 450;
    const x4 = 620;

    const y1 = mapY(currentStockData.open);
    const y2 = mapY(currentStockData.low);
    const y3 = mapY(currentStockData.high);
    const y4 = mapY(currentStockData.current);

    // Price labels
    fill(255);
    noStroke();
    textSize(14);
    textAlign(RIGHT, CENTER);

    text(currentStockData.high.toFixed(2), 45, 50);
    text(((currentStockData.high + currentStockData.low) / 2).toFixed(2), 45, height / 2);
    text(currentStockData.low.toFixed(2), 45, height - 50);

    noFill();
    stroke(currentStockData.isPositive ? color(16,185,129) : color(239,68,68));
    strokeWeight(3);

    beginShape();
    vertex(x1,y1);
    vertex(x2,y2);
    vertex(x3,y3);
    vertex(x4,y4);
    endShape();

    fill(255);
    textAlign(CENTER);

    text("Open", x1, height - 20);
    text("Low", x2, height - 20);
    text("High", x3, height - 20);
    text("Current", x4, height - 20);

    fill(255);
    noStroke();

    circle(x1,y1,8);
    circle(x2,y2,8);
    circle(x3,y3,8);
    circle(x4,y4,10);

    fill(255);
    textSize(14);
    textAlign(CENTER);

    text("$" + currentStockData.open.toFixed(2), x1, y1 - 15);
    text("$" + currentStockData.low.toFixed(2), x2, y2 - 15);
    text("$" + currentStockData.high.toFixed(2), x3, y3 - 15);
    text("$" + currentStockData.current.toFixed(2), x4, y4 - 15);
      } 
  
  else {

    fill(180);
    noStroke();
    textAlign(CENTER,CENTER);
    textSize(20);
    text("Awaiting stock data...", width/2, height/2);

  }
}

fill(255);
noStroke();
textSize(14);

text("Open", 600, 30);
text("Low", 600, 50);
text("High", 600, 70);
text("Current", 600, 90);