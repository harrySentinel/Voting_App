const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();

// bodyParser is a middleware.
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;


app.listen(PORT ,()=>{
    console.log('listening on port 3000');
})

// import the router files
const userRoutes = require('./routes/userRoutes');


// use the routers
app.use('/user', userRoutes);