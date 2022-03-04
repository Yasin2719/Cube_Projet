require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const UserRouter= require('./api/User');



//app.use(express.json());

module.exports = app;