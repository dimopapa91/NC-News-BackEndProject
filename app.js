const express = require('express');
const jest_sorted = require('jest-sorted');
const { getTopics } = require('./controllers/topics.controllers');

const app = express();


app.get('/api/topics', getTopics);
app.all('*', (req, res) => {
    res.status(404).send({ msg: 'error not found'})
});

module.exports = app;