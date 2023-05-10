const { fetchTopics, fetchApi } = require('../models/topics.models');


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