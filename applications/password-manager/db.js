const { Sequelize } = require('sequelize');

const dbURI = (
    process.env.DATABASE_URL ||
    'postgres://postgres:niranjan@kshirsagar:5432/heroku_local'
);

const postgreDB = new Sequelize(dbURI);

postgreDB.authenticate()
.then(() => console.log("PostgreSQL DB authentication success"))
.catch((error) => console.error(error));

module.exports = { postgreDB };