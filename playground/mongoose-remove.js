const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '58a6abb218867d5c60b4ff90';


// .remove()
// Todo.remoce({}).then((result) => {
//     console.log(result);
// });

//Todo.findOneAndRemove()
//Todo.findByIdAndRemove()

Todo.findByIdAndRemove(id).then((todo) => {
    console.log(todo);
});