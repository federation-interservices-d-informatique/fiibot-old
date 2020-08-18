require('dotenv').config();
const FIIB = require('./classes/client');
const Client = new FIIB({
    token: process.env.TOKEN,
    prefix: '&'
});
