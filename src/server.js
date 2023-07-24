import { app } from './app';
import { port } from './config/config';

console.log('Node Js Starter with Sequelize ORM!!');
import './cronJobs';
// eslint-disable-next-line import/order
import { createServer } from 'http';
// socket initialization
const server = createServer(app);
// eslint-disable-next-line import/order
const io = require('socket.io')(server, { cors: { origin: '*' } });

global.io = io;
require('./config/rootSocket')(io);

server.listen(port, () => {
    console.log(`Server Listening on port ${port}`);
});
