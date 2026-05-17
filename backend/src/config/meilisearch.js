const { Meilisearch } = require('meilisearch');

const client = new Meilisearch({
  host: process.env.MEILI_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY,
});

module.exports = client;