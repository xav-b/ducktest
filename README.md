# Duck Test - API Contract Enforcement

> If it looks like a duck, swims like a duck, and quacks like a duck, then it probably is a duck

`ducktest` reads what an API should do, hits it and compares the result. If it
looks the same, [Jest][jest] test passes.

It aims at defining API contracts in a declarative way, used for both
cross-functionnal collaboration AND System Integration Testing. In other words,
a single definition should be great to share with your fellow frontend
colleagues, while still being used by Jest for _delightful_ testing.

**Disclaimer: project at _tinkering around_ stage. There's no generic way to install and use it outside of this repository at the moment. Mostly because I don't want to waste time on the CLI UX while the testing API is not even figured out yet.**

Testing is powered by [Jest][jest] for its extensive matchers library and great
output. API schema validation is powered by [Joi][joi] as the most comprehensive
and expressive validation library around.

## Example - fixer.io API

Configuration as Code:

```javascript
const Joi = require('joi')

const scenario = {
  query: {
    access_key: process.env.FIXER_API_KEY,
    base: 'USD',
    symbols: 'GBP,JPY'
  },

  response: {
    code: 200,
    payload: Joi.object({
      success: true,
      timestamp: Joi.date().timestamp(),
      base: Joi.string(),
      date: Joi.date(),
      rates: Joi.object({
        GBP: Joi.number(),
        JPY: Joi.number(),
    })
  } 
}

module.exports = {
  project: 'Example',
  domain: 'https://data.fixer.io',
  scope: 'exchange rate',

  method: 'GET',
  endpoint: '/api/latest',

  scenarios: [scenario],
}
```


## Usage

Contract example: `./contracts/coincap`.

Tested under `node v14.17.5` (LTS at I write this) and `npm 7.20.6`.

```console
# install
npm install

# test
npm test

# voila
```

Possible future evolution:

```console
# search configurations and generate tests
npx ducktest discover ./contracts

ls __tests__/sit/
# ... code generated ...

# run the test suite
ducktest coincoin --environment staging
```


[jest]: https://jestjs.io/
[joi]: https://joi.dev/api/
