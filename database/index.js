const knex  = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        // user: 'user',
        // password: 'password'   --use this if you put a password,
        database: 'node_and_sql_db'
    }
});

module.exports = knex;