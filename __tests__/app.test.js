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
            console.log(res.body);
            expect(res.body.article).toHaveProperty('author');
            expect(res.body.article).toHaveProperty('title');
            expect(res.body.article).toHaveProperty('article_id');
            expect(res.body.article).toHaveProperty('body');
            expect(res.body.article).toHaveProperty('topic');
            expect(res.body.article).toHaveProperty('created_at');
            expect(res.body.article).toHaveProperty('votes');
            expect(res.body.article).toHaveProperty('article_img_url');
        })
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

