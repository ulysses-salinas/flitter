const express = require('express');
const router = express.Router();
const db = require('../../database');   //database is the name of the directory names in VS under node-and-sql directory


//below database access to render data onto the screen
router.get('/', function(req, res)  {
    db.select().from('todo').orderBy('id').then(function(data)    {
        res.send(data);
    });                     
});

//POST request
router.post('/', function(req, res) {
    //INSERT and RETURNING into the "todo" table
    db.insert(req.body).returning('*').into('todo').then(function(data)    {
        res.send(data);
    });
});

//PATCH request localhost:3000/api/todo/"id#" i.e 1, 2, etc..." this will update the one we send
router.patch('/:id', function(req, res)   {
    db('todo').where({id: req.params.id}).update(req.body).returning('*').then(function(data)   {
        res.send(data);
    });
});

//PUT request localhost:3000/api/todo/"id#" i.e 1, 2, etc..." will update everything
router.put('/:id', function(req, res)   {
    db('todo').where({id: req.params.id}).update(   {
        title: req.body.title   || null,            //if title is undefined then make it null
        is_done: req.body.is_done   || null
    }).returning('*').then(function(data)   {
        res.send(data);
    });
});

//DELETE request
router.delete('/:id', function(req, res)    {
    db('todo').where({id: req.params.id}).del().then(function() {
        res.json({success: true});
    });
});

//GET SINGLE
router.get('/:id', function(req, res)   {
    db('todo').where({id: req.params.id}).select().then(function(data)  {
        res.send(data);
    });
});



module.exports = router;

//localhost:8000/api/todo