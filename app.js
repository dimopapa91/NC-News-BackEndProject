const express = require('express');
const jest_sorted = require('jest-sorted');
const { getTopics, getApi, getArticlesId } = require('./controllers/topics.controllers');

const app = express();

//GET
app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticlesId);

//Error Handling
app.all('*', (req, res) => {
    res.status(404).send({ msg: 'page not found'})
});

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
})
app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({ msg: 'bad request!' });
    }
})
app.use((err, req, res, next) => {
    res.status(500).send('Something is not working!');
});




module.exports = app;