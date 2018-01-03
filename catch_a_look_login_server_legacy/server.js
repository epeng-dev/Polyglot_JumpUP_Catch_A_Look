var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var dbconfig = require('./config/db.js');
var sessionkey = require('./config/sessionkey.js');
var connection = mysql.createConnection(dbconfig);
var app = express();
app.use(session(sessionkey));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var router = require('./router/main')(app, connection);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function(){
  console.log("Express server has started on port 3000");
});

app.use(express.static('public'));
