
const { 
    fetchTopics,
    fetchApi, 
    fetchArticlesId,
    fetchArticles 
} = require('../models/topics.models');


    exports.getTopics = (req, res) => {

    // console.log('Inside Controller')
    const sortBy = req.query.sort_by;
    fetchTopics(sortBy).then((topics) => {
        res.status(200).send({ topics })
    });
};
    exports.getApi = (req, res, next) => {
    fetchApi().then((result) => {
        res.status(200).send({ result })
    }).catch((err) => {
        next(err);
    });

};
    exports.getArticlesId = (req, res, next) => {
        const id = req.params.article_id;
        fetchArticlesId(id).then((article) => {
            res.status(200).send({ article })
        }).catch((err) => {
            next(err);
        });
    };
    exports.getArticlesId = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticlesId(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch((err) => {
        next(err);
    });
};


