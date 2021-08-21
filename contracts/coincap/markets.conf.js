/**
 *
 *  Validating CoinCap markets API endpoint.
 *  Documentation: https://docs.coincap.io/#d8fd6001-e127-448d-aadd-bfbfe2c89dbe
 *
 */

const Joi = require('joi')

const exchange = {
  exchangeId: Joi.string(),
  rank: Joi.string(),
  baseSymbo: Joi.string(),
  baseI: Joi.string(),
  quoteSymbo: Joi.string(),
  quoteI: Joi.string(),
  priceQuote: Joi.string(),
  priceUsd: Joi.string(),
  volumeUsd24Hr: Joi.string(),
  percentExchangeVolume: Joi.string().required(),
  tradesCount24Hr: Joi.string(),
  updated: Joi.string(),
}

const scenario = {
  name: 'default',

  // TODO: generate scenarios? Loop over combo of request response
  query: {
    baseSymbol: 'BTC',
    limit: 5
  },

  response: {
    code: 200,
    payload: Joi.object({
      data: Joi.array().items(Joi.object(exchange)).max(5).unique('exchangeId'),
      timestamp: Joi.number().integer().greater(1533581173350).required(),
    })
  }
}

module.exports = {
  project: 'CoinMarket',
  domain: 'https://api.coincap.io',
  scope: 'markets',

  // NOTE: not used, only GET supported anyway
  method: 'GET',
  endpoint: '/v2/markets',

  scenarios: [scenario],
}
