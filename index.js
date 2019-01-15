const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile.js');

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// endpoints here

// get
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// add
server.post('/api/zoos', (req, res) => {
  if(req.body.name) {
    db('zoos')
      .insert(req.body)
      .then(id => {
          res.status(201).json(id);
      })
      .catch(err => {
        res.status(409).json({error: 'Name might already exist'});
      });
  } else {
    res.status(412).json({ error: 'Please submit a name'});
  }
});

// update

//delete

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
