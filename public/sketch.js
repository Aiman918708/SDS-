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
  } catch (error) {
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
  background(4, 5, 46);

  stroke(34, 0, 124, 100);
  for (let i = 0; i < width; i += 50) line(i, 0, i, height);
  for (let j = 0; j < height; j += 50) line(0, j, width, j);

  if (!currentStockData || !currentStockData.prices) {
    fill(200);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    text("Loading chart data...", width / 2, height / 2);
    return;
  }

  const prices = currentStockData.prices;

  const minVal = Math.min(...prices);
  const maxVal = Math.max(...prices);

  function mapY(v) {
    return map(v, minVal, maxVal, height - 50, 50);
  }

  noFill();
  stroke(0, 255, 150);
  strokeWeight(2);

  beginShape();

  for (let i = 0; i < prices.length; i++) {
    let x = map(i, 0, prices.length - 1, 50, width - 50);
    let y = mapY(prices[i]);
    vertex(x, y);
  }

  endShape();

  // dots
  fill(255);
  noStroke();

  for (let i = 0; i < prices.length; i += 10) {
    let x = map(i, 0, prices.length - 1, 50, width - 50);
    let y = mapY(prices[i]);
    circle(x, y, 5);
  }
}