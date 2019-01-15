const express = require('express');
const zooRouter = require('./routers/zooRouter.js');
const bearRouter = require('./routers/bearRouter.js');

const server = express();

server.use('/api/zoos', zooRouter);
server.use('/api/bears', bearRouter);

module.exports = server;