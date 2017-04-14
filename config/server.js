//Import deṕendencies
var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

//Init express
var app = express();

//Set vie engine
app.set('view engine', 'ejs');
app.set('views', './app/views');

//Set middlewares
app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

//Init autoload
consign()
	.include('app/routes')
	.then('app/models')
	.then('app/controllers')
	.into(app);

module.exports = app;