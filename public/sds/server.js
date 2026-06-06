const FINNHUB_KEY = 'd8hola9r01qrn5edadr0d8hola9r01qrn5edadrg'; 
const ALPHA_VANTAGE_KEY = 'WK1B39F1ZP86WLZN';

const stockForm = document.getElementById('stockForm');
const tickerInput = document.getElementById('tickerInput');
const symbolEl = document.getElementById('symbol');
const priceEl = document.getElementById('price');
const changeEl = document.getElementById('change');
const tickerTape = document.getElementById('tickerTape');
const newsFeed = document.getElementById('newsFeed');

document.addEventListener('DOMContentLoaded', () => {
  fetchTickerData();
  fetchMarketNews();

  fetchStockData('AAPL');
});

// Stock Search //
stockForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const ticker = tickerInput.value.trim().toUpperCase();
  if (ticker) {
    fetchStockData(ticker);
    tickerInput.value = ''; // Clear input
  }
});

// Fetch Stock Quote //
async function fetchStockData(ticker) {
  try {
    symbolEl.textContent = 'Loading...';
    
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`);
    const data = await response.json();

    if (!data.c) {
      symbolEl.textContent = "Ticker not found";
      priceEl.textContent = "Price: --";
      changeEl.textContent = "Change: --";
      changeEl.style.color = '#f9f5ff';
      return;
    }

    const currentPrice = data.c.toFixed(2);
    const change = data.d.toFixed(2);
    const percentChange = data.dp.toFixed(2);

    // Update UI
    symbolEl.textContent = ticker;
    priceEl.textContent = `Price: $${currentPrice}`;
    changeEl.textContent = `Change: ${change >= 0 ? '+' : ''}${change} (${percentChange}%)`;

    // Dynamic coloring for positive/negative gains
    if (change >= 0) {
      changeEl.style.color = '#10b981'; // Green
    } else {
      changeEl.style.color = '#ef4444'; // Red
    }

  } catch (error) {
    console.error("Error fetching stock data:", error);
    symbolEl.textContent = "Error loading data";
  }
}

// Fetch Ticker Tape //
async function fetchTickerData() {
  const popularTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];
  let tickerString = "";

  try {
    for (const ticker of popularTickers) {
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`);
      const data = await response.json();
      if (data.c) {
        const changeSign = data.d >= 0 ? '▲' : '▼';
        tickerString += `${ticker}: $${data.c.toFixed(2)} (${changeSign} ${data.dp.toFixed(2)}%) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
      }
    }
    tickerTape.innerHTML = tickerString || "Market Data Temporarily Unavailable";
  } catch (error) {
    console.error("Error generating ticker tape:", error);
    tickerTape.textContent = "Error loading market tape.";
  }
}

// Fetch News //
async function fetchMarketNews() {
  try{
    const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=${ALPHA_VANTAGE_KEY}`);
    const data = await response.json();

    if (!data.feed || data.feed.length === 0) {
      newsFeed.textContent = "No recent news available.";
      return;
  }
  newsFeed.innerHTML = '';

  const articles = data.feed.slice(0, 3);
    articles.forEach(article => {
      const articleEl = document.createElement('div');
      articleEl.className = 'news-item';
      articleEl.style.marginBottom = '15px';
      
      articleEl.innerHTML = `
        <h4 style="margin: 0 0 5px 0;"><a href="${article.url}" target="_blank" style="color: #60a5fa; text-decoration: none;">${article.title}</a></h4>
        <p style="color: #a78bfa; font-size: 0.85rem; margin: 0;">Source: ${article.source} | Sentiment: ${article.overall_sentiment_label}</p>
      `;
      newsFeed.appendChild(articleEl);
    });
  }
  catch (error) {
    console.error("Error fetching news:", error);
    newsFeed.textContent = "Failed to load news feed.";
  }
}
