const request = require('supertest');

const { getAllCountryNames, getCountryInfo } = require('../../server/utils/countryUtils');

const app = require('../../server/index');

describe('GET /api/info/:country_name', function () {
  test('Get information about England', async () => {
    await request(app)
      .get('/api/info/england')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .then(result => {
        expect(result.body).toMatchObject({
          "country": "England",
          "famousPlate": "Bangers and Mash",
          "population": "56 million",
          "descriptions": [
            "Meat dishes are especially popular across England, along with fish and chips (fried fish with French fries), but one pub favorite is a favorite of ours, as well: bangers and mash. This simple dish features sausage (the banger) and mashed potatoes (the mash).",
            "It is often accompanied by fried onions in gravy and a side of peas. (Something in the dish should be healthy, right?)",
            "*Note: Though the UN recognizes the United Kingdom as a whole, we're highlighting the dishes of England, Wales, Scotland and Northern Ireland separately, since they're so distinct. "
          ],
          "countryCode": "GB",
          "famousPlateUrl": "https://thumbor.granitemedia.com/bangers-and-mash/h8-mQ8wZjCOCMtqcSMdbe2hfOes=/800x600/filters:format(webp):quality(80)/granite-web-prod/3f/5f/3f5fcd00a4a640faa0129a62565e68bf.jpeg",
          "flagSmUrl": "https://www.countryflags.io/GB/shiny/16.png",
          "flagLgUrl": "https://www.countryflags.io/GB/shiny/64.png"
        });
      });
  });

  test('Get information about every country', async () => {
    const countryNames = getAllCountryNames();

    return Promise.all(countryNames.map(async country_name =>
      await request(app)
        .get('/api/info/' + country_name)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(result => {
          expect(result.body).toMatchObject(getCountryInfo(country_name));
        })
    ));
  });
});
