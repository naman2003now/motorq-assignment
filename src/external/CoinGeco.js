const axios = require("axios");

class CoinGecko {
  constructor(airtable) {
    this.airtable = airtable;
    this.api = axios.create();
    this.cache = {};
    setInterval(() => {
      this.update();
    }, 600_000);
  }

  async getTop20() {
    const response = await this.api.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "inr",
          order: "market_cap_desc",
          per_page: "20",
          page: "1",
          sparkline: "false",
          locale: "en",
        },
      }
    );

    const coins = response.data.map((coin) => {
      return { id: coin.id, symbol: coin.symbol, name: coin.name };
    });
    return coins;
  }

  async getCoinPrice(coin_id) {
    if (this.cache[coin_id]) return this.cache[coin_id];
    const coins = await this.getNewCoinPrices([coin_id]);
    return coins;
  }

  async getNewCoinPrices(coin_ids) {
    const response = await this.api.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: coin_ids.join(","),
          vs_currencies: "inr",
          include_market_cap: "true",
        },
      }
    );
    return response.data;
  }

  async update() {
    var top_20_coins = await this.getTop20();
    const coin_ids = top_20_coins.map((coin) => coin.id);
    const top_20_prices = await this.getNewCoinPrices(coin_ids);

    top_20_coins = top_20_coins.map((coin, idx) => {
      return {
        ...coin,
        ...top_20_prices[idx],
      };
    });
    top_20_coins.map((coin) => {
      this.cache[coin.id] = coin;
    });
    this.airtable.update(top_20_coins);
  }
}

module.exports = CoinGecko;
