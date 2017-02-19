const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '58a69c4237006e70b0f185c6';

// if (!ObjectId.isValid(id)) {
//     console.log('Id not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }

//     console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

var userId = '58a3ecc6c234de549c0e3b25';

if (!ObjectId.isValid(userId)) {
    console.log('invalid User Id');
}

User.findById(userId).then((user) => {
    if (!user) {
        return console.log('User not found');
    }

    console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
