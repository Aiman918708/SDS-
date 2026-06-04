const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;
const API_KEY = 'WK1B39F1ZP86WLZN';

app.get('/api/stock/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();

    const url =
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);

  }
  catch (error) {
    console.error('Stock fetch error:', error);

    res.status(500).json({
      error: 'Failed to fetch stock data'
    });
  }
}
);

/* Ticker Tape Data */
app.get('/api/tickers', async (req, res) => {
  try {

    const tickers = [
      'AAPL',
      'MSFT',
      'NVDA',
      'TSLA',
      'AMD'
    ];

    const results = [];

    for (const ticker of tickers) {

      const url =
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data["Global Quote"]) {
        results.push(data["Global Quote"]);
      }
    }

    res.json(results);

  }
  catch (error) {
    console.error('Ticker fetch error:', error);

    res.status(500).json({
      error: 'Failed to fetch ticker data'
    });
  }
}
);

/* Start Server */
app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});