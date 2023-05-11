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
          .then((res) => {
            expect(res.body.topics.length).toBe(3);
            expect(res.body.topics[0]).toHaveProperty('slug');
            expect(res.body.topics[0]).toHaveProperty('description');
          });
    });
    test("GET - status: 404 - responds with error", () => {
        return request(app)
          .get("/api/nonsense")
          .expect(404)
          .then((res) => {
            expect(res.status).toBe(404);
            expect(res.body.msg).toBe("page not found");
          });
      });
});
describe('/api', () => {
    test('GET - status: 200 - returns status with JSON object', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((res) => {
            expect(typeof res.body.result).toBe('object');
            expect(res.body.result).toHaveProperty('GET /api');
            expect(res.body.result).toHaveProperty('GET /api/topics');
            expect(res.body.result).toHaveProperty('GET /api/articles');
        });
    });
});
describe('/api/articles/:article_id', () => {
    test('GET - status: 200 - get articles by id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
            expect(res.body.article).toEqual({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
              });
        });
    });
    test('GET - status: 404 - Should return an error when article not found', () => {
        return request(app)
          .get('/api/articles/900')
          .expect(404)
          .then((res) => {
            expect(res.body).toEqual({ msg: 'Article not found' });
          });
      });
      test('GET - status: 400 - Should return an error when article not found', () => {
        return request(app)
          .get('/api/articles/nonsense')
          .expect(400)
          .then((res) => {
            expect(res.body).toEqual({ msg: 'bad request!' });
          });
      });  
});

