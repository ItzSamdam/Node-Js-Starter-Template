import { dbUser, dbPass, dbName, dbHost, port as _port } from './config';

export const development = {
    username: dbUser,
    password: dbPass,
    database: dbName,
    host: dbHost,
    dialect: 'mysql',
    dialectOptions: {
        bigNumberStrings: true,
    },
};
export const test = {
    username: dbUser,
    password: dbPass,
    database: dbName,
    host: dbHost,
    dialect: 'mysql',
    dialectOptions: {
        bigNumberStrings: true,
    },
};
export const production = {
    username: dbUser,
    password: dbPass,
    database: dbName,
    host: dbHost,
    port: _port,
    dialect: 'mysql',
    dialectOptions: {
        bigNumberStrings: true,
    },
};
