var express = require('express');
var app = express();
var request = require('request');
var handlebars = require('express-handlebars').create({defaultlayout:'main'});
var session = require('express-session');

var bodyParser = require('body-parser');
app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
var pass = "123";

app.use(express.static('public'));
app.use(session({secret:pass}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var key = require('./credential.js');
var mysql = require('./connection.js');
//var pool = mysql.pool;
//var owaID="fa7d80c48643dfadde2cced1b1be6ca1";
//var appID = 'c47acb4ad586f4224feb794843d48138';
var owaID = key.owaID;
var appID = key.appID;
var city = 'Corvallis';
var state = 'OR';

app.use('/seeds', require('./seeds.js')); 
app.use('/beds', require('./beds.js')); 
app.use('/family', require('./family.js')); 
app.use('/month', require('./month.js')); 
app.use('/affects', require('./affects.js')); 
app.use('/planted', require('./planted.js')); 
app.use('/planning', require('./planning.js')); 



app.get('/',function(req,res){
  res.render('home');
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
