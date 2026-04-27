// Major Project
// Aiman Fatima Adnan
// 27/04/2026

// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let stockData;
let request = require('request');
let url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=GKYRF5RF3G9HUU0U';

request.get({
  url: url,
  json: true,
  headers: {'User-Agent';'request'}
}, (err, res, data) = > {
  if (err) {
    console.log('Error:', err);
  } 
  else if (res.statusCode !== 200) {
    console.log('Status;', res.statusCode);
  } 
  else {
    console.log(data);
  }
}
})

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 0, 51);
}
