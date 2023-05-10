const express = require('express');
const jest_sorted = require('jest-sorted');
const { getTopics, getApi } = require('./controllers/topics.controllers');

const app = express();


app.get('/api', getApi);
app.get('/api/topics', getTopics);


app.all('*', (req, res) => {
    res.status(404).send({ msg: 'page not found'})
});
app.use((err, req, res, next) => {
    res.status(500).send('Something is not working!');
});




module.exports = app;