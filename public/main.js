// Manages Website, Asks server.js for data
let currentStockData = null;

const summaryEl = document.getElementById("summary");

const FINNHUB_KEY = 'd8hola9r01qrn5edadr0d8hola9r01qrn5edadrg'; 
const ALPHA_VANTAGE_KEY = 'WK1B39F1ZP86WLZN';

const stockForm = document.getElementById('stockForm');
const tickerInput = document.getElementById('tickerInput');
const symbolEl = document.getElementById('symbol');
const priceEl = document.getElementById('price');
const changeEl = document.getElementById('change');
const tickerTape = document.getElementById('tickerTape');
const newsFeed = document.getElementById('newsFeed');

document.addEventListener("DOMContentLoaded", () => {
  fetchTickerData();
  if (document.getElementById("newsFeed")) {
    fetchMarketNews();
  }
  if (symbolEl && priceEl && changeEl) {
    fetchStockData("AAPL");
  }
});

// Stock Search
if (stockForm) {
  stockForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const ticker = tickerInput.value.trim().toUpperCase();
    if (ticker) {
      fetchStockData(ticker);
    }
  });
}

// Fetch Stock Quote
async function fetchStockData(ticker) {
  console.log("Searching:", ticker);
  try {
    symbolEl.textContent = 'Loading...';
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`);
    const data = await response.json();
    console.log(data);

    if (!data.c) {
      symbolEl.textContent = "Ticker not found";
      priceEl.textContent = "Price: --";
      changeEl.textContent = "Change: --";
      changeEl.style.color = '#f9f5ff';
      currentStockData = null;
      return;
    }

    const currentPrice = data.c.toFixed(2);
    const change = data.d.toFixed(2);
    const percentChange = data.dp.toFixed(2);

    console.log("Ticker:", ticker);
    console.log("Price:", currentPrice);
    console.log("Change:", change);

    symbolEl.textContent = ticker;
    priceEl.textContent = `Price: $${currentPrice}`;
    changeEl.textContent = `Change: ${change >= 0 ? '+' : ''}${change} (${percentChange}%)`;
    changeEl.style.color = change >= 0 ? '#10b981' : '#ef4444';

    currentStockData = {
      open: data.o,
      low: data.l,
      high: data.h,
      current: data.c,
      isPositive: change >= 0
    };
    console.log(currentStockData);
    generateMarketSummary(data, ticker);
  } 
  catch (error) {
    console.error("Error fetching stock data:", error);
    symbolEl.textContent = "Error loading data";
    currentStockData = null;
  }
}

// Summary
function generateMarketSummary(data, ticker) {
    let summary = `${ticker} is currently trading at $${data.c.toFixed(2)}. `;

    if (data.dp > 3) {
        summary += "The stock is having a strong positive trading session. ";
    }
    else if (data.dp > 0) {
        summary += "The stock is slightly higher today. ";
    }
    else if (data.dp < -3) {
        summary += "The stock is experiencing significant selling pressure today. ";
    }
    else {
        summary += "The stock is relatively stable today. ";
    }
    summary += `Today's range is $${data.l.toFixed(2)} to $${data.h.toFixed(2)}. `;

    if (data.c > data.o) {
        summary += "The stock is trading above today's opening price.";
    } else {
        summary += "The stock is trading below today's opening price.";
    }

    summaryEl.textContent = summary;
}

// Fetch Ticker Tape
async function fetchTickerData() {
  const popularTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];
  let tickerString = "";
  try {
    for (const ticker of popularTickers) {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`
        );

        const data = await response.json();
        if (data.c) {
          const changeSign = data.d >= 0 ? "▲" : "▼";
          tickerString +=
        `${ticker}: $${data.c.toFixed(2)} (${changeSign} ${data.dp.toFixed(2)}%) &nbsp;&nbsp;&nbsp;&nbsp;`;
        }
      }
      catch (err) {
        console.log("Couldn't load", ticker);
      }
    }

    tickerTape.innerHTML = tickerString || "Market Data Temporarily Unavailable";
  } 
  catch (error) {
    console.error("Error generating ticker tape:", error);
    tickerTape.textContent = "Error loading market tape.";
  }
}

// Fetch News
async function fetchMarketNews(ticker = "AAPL") {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&limit=20&sort=LATEST&apikey=${ALPHA_VANTAGE_KEY}`);
    const data = await response.json();

    if (!data.feed || data.feed.length === 0) {
      newsFeed.textContent = "No recent news available.";
      return;
    }
    newsFeed.innerHTML = '';

    const articles = data.feed.slice(0, 15);
    articles.forEach(article => {
      const articleEl = document.createElement('div');
      articleEl.className = 'news-item';
      articleEl.style.marginBottom = '15px';
      
      articleEl.innerHTML = `
      <img src="${article.banner_image}" class="news-image">

      <h3>
      <a href="${article.url}" target="_blank">
      ${article.title}
      </a>
      </h3>

      <p>
      ${article.summary}
      </p>

      <p class="news-source">
      ${article.source}
      </p>
      `;
      newsFeed.appendChild(articleEl);
    });
  }
  catch (error) {
    console.error("Error fetching news:", error);
    newsFeed.textContent = "Failed to load news feed.";
  }
}
