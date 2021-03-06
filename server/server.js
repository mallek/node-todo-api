require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
//const jwt = require('jsonwebtoken');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// POST /todo {Todo}
// posts a new todo to the db
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});


// GET /todos
// Gets all todos
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});


// GET /todos/12345
// Gets a todo by id
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send({ error: 'Id not found' });
        }

        res.send({ todo });
    }).catch((e) => res.status(400).send({ error: 'major error' }));

});

// DELETE /todos/58a6abb218867d5c60b4ff90
// Delete a todo by id
app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send({ error: 'id not found to delete' });
        }

        res.send({ todo });

    }).catch((e) => res.status(400).send({ error: 'major error deleting by id' }));
});

// PATCH /todos/:id
// Update a todo
app.patch('/todos/:id', authenticate, function (req, res) {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(404).send();
    });

});

// Post /users
//pick email, password
app.post('/users', function (req, res) {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        //console.log(token);
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        //console.log('bad request', e);
        res.status(400).send(e);
    });
});



//GET /users/me
app.get('/users/me', authenticate, function (req, res) {
    res.send(req.user);
});

//POST /users/login {email, password}
app.post('/users/login', function (req, res) {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });

});

// DELETE /users/me/token
app.delete('/users/me/token', authenticate, function(req, res) {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    },  function () {
        res.status(400).send();
    });
});

//todo add a delete user route

app.listen(port, () => {
    console.log(`started on port ${port}`);
});


module.exports = { app };