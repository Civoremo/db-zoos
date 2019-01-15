const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile.js');

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// endpoints here

// get zoos
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// get zoo by id
server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .then(zoo => {
      if(zoo.length >= 1) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: 'Zoo ID could not be found'});
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// add zoo
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

// update zoo
server.put('/api/zoos/:id', (req, res) => {
  if(req.body.name) {
    db('zoos')
      .where({ id: req.params.id })
      .update(req.body)
      .then(count => {
        if(count >= 1) {
          res.status(200).json(count);
        } else {
          res.status(404).json({ message: 'Zoo not found' });
        }
      })
      .catch();
  } else {
    res.status(412).json({ error: 'Please provide key for name'});
  }
});

//delete zoo
server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if(count >= 1) {
        res.status(200).json({ count: `Zoo has been deleted` });
      } else {
        res.status(404).json({ error: 'Zoo ID could not be found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Server error, try again' });
    });
});

// get bears
server.get('/api/bears', (req, res) => {
  db('bears')
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(err => {
      res.status(500).json({ error: 'Server error retrieving bears' });
    });
});

// get bear by id
server.get('/api/bears/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .then(bear => {
      if(bear.length >= 1) {
        res.status(200).json(bear);
      } else {
        res.status(404).json({ message: 'Bear with that ID could not be found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Server error finding bear by id' });
    });
});

// post new bear
server.post('/api/bears', (req, res) => {
  if(req.body.name) {
    db('bears')
      .insert(req.body)
      .then(id => {
        res.status(201).json(id);
      })
      .catch(err => {
        res.status(409).json({ error: 'Bear might already exist, try another' });
      });
  } else {
    res.status(412).json({ error: 'Please provide name' });
  }
});

// update bear
server.put('/api/bears/:id', (req, res) => {
  
  if(req.body.name) {
    db('bears')
      .where({ id: req.params.id })
      .update(req.body)
      .then(count => {
        if(count >= 1) {
          res.status(200).json(count);
        } else {
          res.status(404).json({ message: 'Bear not found' });
        }
      })
      .catch();
  } else {
    res.status(412).json({ error: 'Please provide key for name' });
  }
});

// delete bear
server.delete('/api/bears/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if(count >= 1) {
        res.status(200).json({ count: "Bear has been deleted" });
      } else {
        res.status(404).json({ error: 'Bear ID not found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Server error deleting column' });
    });
});


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
