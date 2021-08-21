const log = require('debug')('ducktest.lib')
const request = require('superagent')
const chrome = require('chrome-cookies-secure')
const logNetworkTime = require('superagent-node-http-timings')

const HEADERS = {
  accept: 'application/json',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  'content-type': 'charset=utf-8; application/json',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'sec-gpc': 1,
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
}

const round = num => Math.round((num + Number.EPSILON) * 100) / 100

function onTracing(err, report) {
  const { firstByte, total } = report.timings
  const rate = round((firstByte / total) * 100)

  log(`tracing report: ${firstByte} (${rate}%)`)
}

async function hitEureka(endpoint, params, cookies) {
  log('updating headers')
  HEADERS.referer = endpoint

  log('hitting:', endpoint)
  return request
    .get(endpoint)
    .use(logNetworkTime(onTracing))
    .set(HEADERS)
    .set('Cookie', cookies || '')
    .query(params)
}

const captureSession = (domain) =>
  new Promise((resolve, reject) => {
    log(`loading browser cookies for: ${domain}`)
    chrome.getCookies(domain, 'header', (err, cookies) => {
      if (err) reject(err)
      else {
        log(`successfully loaded cookies`)
        const session = process.env.SESSION_COOKIE
        if (!session) log('no custom session found')
        else {
          log('injecting custom session token into cookies')
          const extended = cookies + `; ${session}`
          resolve(extended)
        }
      }
    })
  })

module.exports = { captureSession, hitEureka }
