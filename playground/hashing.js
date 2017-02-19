const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'mypassword!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPass = '$2a$10$xaxXoj/wubswSgu3q1oMtu1Zhcbybrx9Y8sCVuZcTWe6HQKQZ2ypu';

bcrypt.compare(password, hashedPass, (err, res) => {
    console.log('good password: ',res);
});

bcrypt.compare('wrong pass', hashedPass, (err, res) => {
    console.log('bad password: ',res);
});


// var salt = 'imsalty';

// var data = {
//     id: 4
// };

// var token = jwt.sign(data, salt);
// console.log(token);

// var decoded = jwt.verify(token, salt);
// console.log(decoded);


// //Manual SHA256 token

// var message = 'i am user number ' + decoded.id;

// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + salt).toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + salt).toString();

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();


// if (resultHash === token.hash) {
//     console.log('data was not changed');
// } else {
//     console.log('data was changed. Dont trust');
// }