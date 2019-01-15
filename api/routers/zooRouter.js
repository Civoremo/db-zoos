const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('../../knexfile.js');

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// get zoos
server.get('/', (req, res) => {
db('zoos')
    .then(result => {
    res.status(200).json(result);
    })
    .catch(err => {
    res.status(500).json(err);
    });
});

// get zoo by id
server.get('/:id', (req, res) => {
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
server.post('/', (req, res) => {
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
server.put('/:id', (req, res) => {
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
server.delete('/:id', (req, res) => {
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


module.exports = server;