const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./modles/todo');
var {User} = require('./modles/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST /todo {Todo}
// posts a new todo to the db
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});


// GET /todos
// Gets all todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});


// GET /todos/12345
// Gets a todo by id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({ error: 'Id not found' });
        }

        res.send({ todo });
    }).catch((e) => res.status(400).send({ error: 'major error' }));

});

// DELETE /todos/58a6abb218867d5c60b4ff90
// Delete a todo by id
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({ error: 'id not found to delete' });
        }

        res.send({ todo });

    }).catch((e) => res.status(400).send({error: 'major error deleting by id'}));
});



app.listen(port, () => {
    console.log(`started on port ${port}`);
});


module.exports = { app };