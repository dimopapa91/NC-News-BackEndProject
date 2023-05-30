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
describe('/api/articles', () => {
    test('GET - status: 200 - get all the articles but body', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
                expect(res.body.articles.length).toBe(12)
            res.body.articles.forEach((article) => {
                expect(typeof article).toBe('object');
                expect(article).toHaveProperty('article_id');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('author');
                expect(article).not.toHaveProperty('body');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('article_img_url');
                expect(article).toHaveProperty('comment_count');
            });
                expect(res.body.articles).toBeSortedBy('created_at', { descending: true })
        });
    });
});
describe('/api/articles/:article_id/comments', () => {
    test('GET - status 200 - should return a comment including a valid id', () => {
        return request(app)
        .get('/api/articles/9/comments')
        .expect(200)
        .then((res) => {
            res.body.comments.forEach((comment) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        article_id: expect.any(Number),
                        votes: expect.any(Number),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String)
                    })
                )
            });
        });
    });
    test('GET - 400 - should return an error message when invalid path given', () => {
        return request(app)
        .get('/api/articles/nonsense/comments')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('bad request!');
        });
    });
    test('GET - 404 - should return error message when id is not found', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('Input a valid id');
        });
    });
});
describe("/api/articles/:article_id/comments", () => {
    test("POST - status: 201 - responds with success & comment object", () => {
      const newComment = {
        username: "butter_bridge",
        body: "body"
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then((res) => {
          expect(res.body.comment.author).toBe("butter_bridge");
          expect(res.body.comment.body).toBe("body");
        });
    });
    test("POST - status: 400 - responds with error msg having an invalid id ", () => {
        const body = {
            author: "butter_bridge",
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        }
        return request(app)
          .post("/api/articles/nothing/comments")
          .send(body)
          .expect(400)
          .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.msg).toBe("bad request!");
          });
      });
    test("POST - status: 404 - responds with error for non-existent id", () => {
        return request(app)
        .post("/api/articles/999")
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("page not found");
        });
    });
});
describe('/api/articles/:article_id', () => {
    test("PATCH - status: 200 - returns status code 200 and updated object", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((response) => {
          expect(response.body.fetchUpdateArticle.votes).toBe(101);
        });
    });
    test("PATCH - status: 200 - it works with larger integers", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 300 })
        .expect(200)
        .then((response) => {
          expect(response.body.fetchUpdateArticle.votes).toBe(400);
        });
    });
    test("PATCH - status: 404 - with error message", () => {
      return request(app)
        .patch("/api/articles/123456789")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article not existant");
        });
    });
    test("PATCH - status: 400 - error message if the article_id is not a number", () => {
      return request(app)
        .patch("/api/articles/nonsense")
        .send({ inc_votes: 1 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request!");
        });
    });
    test("PATCH - status: 400 - error message if inc_votes is not a number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "Incorrect data type" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Incorrect data type");
        });
    });
  });