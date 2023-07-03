const config = require('./config');

module.exports = {
    //dev credentials
    development: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    //staging credentials
    test: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    //live credentials
    production: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        port: config.port,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
};
