const connection = require('../db/connection');

exports.fetchTopics = () => {
    console.log('Inside Models')
    return connection.query('SELECT * FROM topics;').then((result) => {
       console.log(result.rows)
        return result.rows;
    });
};
