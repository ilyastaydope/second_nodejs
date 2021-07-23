const express = require('express');
const app = express();

const mongoose = require('mongoose');
const User = require('./models/user');

app.use(express.json());
app.post('/users', async (req, res) =>{
    const {username, firstname, lastname, password} = req.body;
    console.log(req.body)
    const userExist = await User.findOne({username}).exec();
    console.log(username);
    console.log(userExist);
    if(userExist) {
        res.status(400).send({message: 'Username already exist'}).end();
    }

    const user = new User({username, firstname, lastname, password});
    await user.save();
    res.send({message: `User with username ${user.username} created!`}).end();
});

app.delete('/users/:username', async(req, res) =>{
    const {username} = req.params;
    const user = await User.findOne({ username }).exec();
    if (!user) {
        res.status(404).send({
            message: `The user with ${username} in not exist!`
        }.end());
    }
    await User.deleteOne({username}).exec();

    res.send({
        message: 'User was deleted!'
    }).end();

})
app.use('/', async (req, res, next) => {
    console.log(req);
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64')
        .toString()
        .split(':');
    const user = await User.findOne({ username }).exec();

    console.log(user);
    console.log('user');

    const userNotFound = !user;
    const passwordsNotMatch = user && user.password !== password;
    if(userNotFound || passwordsNotMatch) {
        res.status(401).send({
            message: userNotFound ? 'User not found' : 'Passwords not match',
        });
       return
    }
    req.user = user;
    next();
});



const dotenv = require('dotenv');

dotenv.config();

const port = process.env.APP_PORT;
const connectionString = 'mongodb+srv://danit_1:danit123@cluster0.wzzoj.mongodb.net/danit?retryWrites=true&w=majority';


app.get('/login', (req, res) => {
    res.send(`Hello ${req.user.username}!!`);
});

mongoose
.connect(connectionString,{
    useNewUrlParser: true
})
.then (async () =>{
    app.listen(port, () =>{
        console.log(`App start listen on port ${port}`);
    });
});

// const user = new User({
//     firstname: 'Ilya',
//     lastname: 'Stepenko',
//     username: 'ilyastadope',
//     password: 'qwerty',
// });
// await user.save()
// console.log('User created!', user);