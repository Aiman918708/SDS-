// Major Project
// Aiman Fatima Adnan
// 27/04/2026

// Extra for Experts:
// - describe what you did to take this project "above and beyond"

async function loadTickerTape() {
  const response =
    await fetch('http://localhost:3000/api/tickers');

  const data = await response.json();

  let html = '';

  data.forEach(stock => {
    html += `
      ${stock["01. symbol"]}
      ${stock["10. change percent"]}
      •
    `;
  });

  document.getElementById('tickerTape').innerHTML = html;
}

loadTickerTape();