const express = require('express');
const apiRoute = require('./routes/api');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded(  {    // this body.parser urlencoded will enable you to parse nested json data
    extended:true        
}));

app.use('/api', apiRoute);

app.listen('8000', function() {
    console.log('Now listening')
});
