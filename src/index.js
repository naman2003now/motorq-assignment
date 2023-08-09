require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const Airtable = require("./external/Airtable");
const airtable = new Airtable();

const CoinGecko = require("./external/CoinGeco");
const coin_geco = new CoinGecko(airtable);

app.get("/coins", async (req, res) => {
  const coins = await airtable.getAllCoins();
  res.send(coins);
});

app.get("/coins/price/:coin_id", async (req, res) => {
  const price = await coin_geco.getCoinPrice(req.params.coin_id);
  res.send(price);
});

app.listen(process.env.PORT);
