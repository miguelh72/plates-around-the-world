const request = require('supertest');

const { getAllCountryNames, getMatchingCountryNames } = require('./../../server/utils/countryUtils');

const app = require('../../server/index');

describe('GET /api/countries', function () {
  test('Get full list of countries', async () => {
    await request(app)
      .get('/api/countries')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .then(result => {
        expect(result.body).toEqual(expect.arrayContaining(getAllCountryNames()));
      });
  });

  test('Get filtered list of countries', async () => {
    await request(app)
      .get('/api/countries?filter=a')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .then(result => {
        expect(result.body).toEqual(expect.arrayContaining(getMatchingCountryNames('a')));
      });
  });
});
