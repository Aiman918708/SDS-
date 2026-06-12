const FINNHUB_KEY = 'd8hola9r01qrn5edadr0d8hola9r01qrn5edadrg';
const ALPHA_VANTAGE_KEY = 'WK1B39F1ZP86WLZN';

let currentStockData = null;

let stockForm, tickerInput, symbolEl, priceEl, changeEl, summaryEl, tickerTape, newsFeed;

document.addEventListener("DOMContentLoaded", () => {

  stockForm = document.getElementById("stockForm");
  tickerInput = document.getElementById("tickerInput");
  symbolEl = document.getElementById("symbol");
  priceEl = document.getElementById("price");
  changeEl = document.getElementById("change");
  summaryEl = document.getElementById("summary");
  tickerTape = document.getElementById("tickerTape");
  newsFeed = document.getElementById("newsFeed");

  fetchStockData("AAPL");
  fetchTickerData();
  fetchMarketNews("AAPL");

  if (stockForm) {
    stockForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const search = tickerInput.value.trim();
      if (!search) return;

      const ticker = await searchTicker(search);

      if (ticker) {
        fetchStockData(ticker);
        fetchMarketNews(ticker);
      } else {
        symbolEl.textContent = "Results not found";
        priceEl.textContent = "Price: --";
        changeEl.textContent = "Change: --";
      }

      tickerInput.value = "";
    });
  }
});

async function searchTicker(search) {
  const response = await fetch(
    `https://finnhub.io/api/v1/search?q=${encodeURIComponent(search)}&token=${FINNHUB_KEY}`
  );

  const data = await response.json();
  if (!data.result || data.result.length === 0) return null;

  return data.result[0].symbol;
}

async function fetchStockData(ticker) {
  try {
    symbolEl.textContent = "Loading...";

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`
    );

    const data = await response.json();

    if (!data.c) {
      symbolEl.textContent = "Ticker not found";
      return;
    }

    symbolEl.textContent = ticker;
    priceEl.textContent = `Price: $${data.c.toFixed(2)}`;
    changeEl.textContent =
      `Change: ${data.d >= 0 ? "+" : ""}${data.d.toFixed(2)} (${data.dp.toFixed(2)}%)`;

    changeEl.style.color = data.d >= 0 ? "green" : "red";

    currentStockData = {
      open: data.o,
      high: data.h,
      low: data.l,
      current: data.c,
      isPositive: data.d >= 0
    };

    generateMarketSummary(ticker, data);

  } catch (err) {
    console.error(err);
  }
}

function generateMarketSummary(ticker, data) {
  if (!summaryEl) return;

  summaryEl.textContent =
    `${ticker} is trading at $${data.c.toFixed(2)} with a daily change of ${data.dp.toFixed(2)}%.`;
}

async function fetchTickerData() {
  const tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"];

  let html = "";

  for (const t of tickers) {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${t}&token=${FINNHUB_KEY}`
    );

    const d = await res.json();

    if (d.c) {
      html += `${t}: $${d.c.toFixed(2)} (${d.dp.toFixed(2)}%) &nbsp;&nbsp;&nbsp;`;
    }
  }

  if (tickerTape) {
    tickerTape.innerHTML = html;
  }
}

async function fetchMarketNews(ticker = "AAPL") {
  try {
    if (!newsFeed) return;

    newsFeed.innerHTML = "Loading news...";

    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`
    );

    const data = await response.json();

    if (!data.feed || data.feed.length === 0) {
      newsFeed.innerHTML = "No news found.";
      return;
    }

    newsFeed.innerHTML = "";

    data.feed.slice(0, 8).forEach(article => {
      const div = document.createElement("div");
      div.className = "news-item";

      div.innerHTML = `
        <a href="${article.url}" target="_blank">
          <h3>${article.title}</h3>
        </a>
        <p>${article.summary ? article.summary.slice(0, 180) + "..." : ""}</p>
      `;

      newsFeed.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    if (newsFeed) newsFeed.innerHTML = "Failed to load news.";
  }
}