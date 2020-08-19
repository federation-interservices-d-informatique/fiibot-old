const {
    fiiMembers
} = require('./config');
require('dotenv').config();
const FIIB = require('./classes/client');
const Client = new FIIB({
    token: process.env.TOKEN,
    prefix: '&',
    owners: ['743851266635071710', '462796153558138881'],
    fiim: fiiMembers,
    commandPath: [`${__dirname}/commands`]
});
