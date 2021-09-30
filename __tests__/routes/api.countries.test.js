const request = require('supertest');

const { getAllCountryNames, getMatchingCountryNames, getAllCountryFlagUrlsLarge } = require('./../../server/utils/countryUtils');

const app = require('../../server/index');

describe('GET /api/countries', () => {
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

  describe('GET /api/countries/flags', () => {
    test('Get full list of large flag urls', async () => {
      await request(app)
        .get('/api/countries/flags')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(result => {
          expect(result.body).toEqual(expect.arrayContaining(getAllCountryFlagUrlsLarge()));
        });
    });
  });
});
