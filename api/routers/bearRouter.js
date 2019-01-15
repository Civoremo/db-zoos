const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('../../knexfile.js');

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// get bears
server.get('/', (req, res) => {
db('bears')
    .then(bears => {
    res.status(200).json(bears);
    })
    .catch(err => {
    res.status(500).json({ error: 'Server error retrieving bears' });
    });
});

// get bear by id
server.get('/:id', (req, res) => {
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
server.post('/', (req, res) => {
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
server.put('/:id', (req, res) => {

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
server.delete('/:id', (req, res) => {
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


module.exports = server;