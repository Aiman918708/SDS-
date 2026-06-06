async function loadTickerTape() {
  try {
    const response = await fetch('/api/tickers'); 
    const data = await response.json();

    let html = '';
    data.forEach(stock => {
      // Safely read the keys from Alpha Vantage / Fallback format
      let symbol = stock["01. symbol"] || "N/A";
      let change = stock["10. change percent"] || "0.00%";
      
      html += `${symbol} ${change} &nbsp;&bull;&nbsp; `;
    });

    // FIX: Using p5.js native select() instead of document.getElementById
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

// FIX: Move the execution INSIDE p5.js setup so it waits for the page to load!
function setup() {
  let container = select('.chart-placeholder');
  if (container) {
    container.html('');
    let canvas = createCanvas(700, 350);
    canvas.parent(container);
  }
  
  // Call it here! Setup guarantees the HTML elements are fully built first.
  loadTickerTape(); 
}

function draw() {
  background(4, 5, 46);
  
  // Grid lines
  stroke(34, 0, 124, 100);
  for (let i = 0; i < width; i += 50) line(i, 0, i, height);
  for (let j = 0; j < height; j += 50) line(0, j, width, j);
}