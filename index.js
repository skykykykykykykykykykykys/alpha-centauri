/**
 * TODO:
 *  All working code that you have to fulfill the requirement (folder name code)
    Screenshot (everything you need to show to proof that your code is working) (folder name screenshots)
    How to setup your environment to run all the requirement (you can write anything about your system actually) (file name readme.md)
 * 
 * 
 * 
 * 
 * 
 */

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    controller = require('./controller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes');
routes(app);

app.listen(port);
console.log('Eduka Ranking and Grader Server started on ' + port);




