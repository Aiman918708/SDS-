const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
const KEY = 'UYUQUW30JIS47IQU';

app.get('/api/stock/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    const url = `https://alphavantage.co${ticker}&apikey=${KEY}`;
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    res.json(data);
  }

  catch(error) {
    res.status(500).json({error: 'Server Error'});
  }
});

app.listen(3000, () => {
  console.log('Backend server is running on http://localhost:3000');
});