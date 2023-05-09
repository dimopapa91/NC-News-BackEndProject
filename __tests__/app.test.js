const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const connection = require('../db/connection.js');


beforeEach(() => {
    return seed(testData);
});

afterAll(() => connection.end());

describe('/api/topics', () => {
    test('GET - status: 200 - returns all topics', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then((response) => {
            expect(response.body.topics.length).toBe(3);
            expect(response.body.topics[0]).toHaveProperty('slug');
            expect(response.body.topics[0]).toHaveProperty('description');
          });
    });
    test("GET - status: 404 - responds with error", () => {
        return request(app)
          .get("/api/nonsense")
          .expect(404)
          .then((response) => {
            expect(response.status).toBe(404);
            expect(response.body.msg).toBe("page not found");
          });
      });
});


