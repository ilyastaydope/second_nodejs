const express = require('express');
const app = express();

app.use(express.json());

const dotenv = require('dotenv');

dotenv.config();

const port = process.env.APP_PORT;

app.get('/home', (req, res) => {
    console.log(req);
    res.send('Hello node.js!!');
});

app.listen(port, () =>{
    console.log(`App start listen on port ${port}`);
});

