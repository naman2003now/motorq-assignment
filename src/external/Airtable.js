const axios = require("axios");

class Airtable {
  constructor() {
    this.api = axios.create({
      headers: {
        common: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        },
      },
    });
  }

  async getAllCoins() {
    const response = await this.api.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASEID}/coins`
    );
    const fields = response.data.records.map((rows) => rows.fields);
    return fields;
  }

  async update(coins) {}
}

module.exports = Airtable;
