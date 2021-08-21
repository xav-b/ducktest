const archimede = require(`${process.cwd()}/lib`)
// const Joi = require('joi')

const contract = require('../../contracts/coincap/markets.conf.js')

describe(`${contract.project} | markets properties`, () => {
  contract.scenarios.forEach(scenario => {
    test(`variation: ${scenario.name || 'default'} | ${JSON.stringify(scenario.query)}`, async () => {

      const uri = contract.domain + contract.endpoint
      const res = await archimede.hitEureka(uri, scenario.query)

      // test HTTP
      // TODO: map HTTP code based on HTTP verb
      expect(res.status).toBe(scenario.response.code || 200)

      // test payload
      schema = scenario.response.payload
      // expect(Joi.assert(schema, res.body)).contract.toThrow()
      expect(() => schema.validate(res.body, { abortEarly: false, cache: false })).not.toThrow()
      // assert(schema.validate(res.body)).toBeTruthy()
      // expect(schema.validate(res.body)).toBeTruthy()
    })
  })
})
