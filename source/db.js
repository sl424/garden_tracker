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

/*
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('test',context);
    })                                                                    
  });
});
*/
/*

app.get('/show',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM seeds', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    //context.results = JSON.stringify(rows);
    context.results = rows;
		res.json(context);
  });
});
	//mysql.pool.query('INSERT INTO workouts (name,reps,weight,date,lbs) values (?)', 

app.post('/add',function(req,res,next){
  var context = {};
	mysql.pool.query('INSERT INTO seeds (`fid`,`name`,`do_best`,`sunlight`,`water`,`area`) values (?,?,?,?,?,?)', 
		[req.body.fid, req.body.name,req.body.do_best, req.body.sunlight, req.body.water, req.body.area ], 
		function(err, result){
		if ( err ) {
			next( err );
			return;
		}
		if ( result.affectedRows ){
			mysql.pool.query( 'SELECT * FROM seeds WHERE id=?',
				[result.insertId],
				function(err, rows, fields){
				if ( err ) {
					next( err );
					return;
				}
			context.results = rows;
			res.json(context);
			//console.log(rows);
			});
		}
	});
});

app.post('/update',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE seeds SET fid=?, name=?, do_best=?, sunlight=?, water= ?, area=? WHERE id=? ",
		[req.body.fid, req.body.name,req.body.do_best, req.body.sunlight, req.body.water, req.body.area, req.body.id ], 
    function(err, result){
    if(err){
      next(err);
      return;
    }
		if ( result.affectedRows ){
			mysql.pool.query( 'SELECT * FROM seeds WHERE id=?',
				[req.body.id],
			//	[result.insertId],
				function(err, rows, fields){
				if ( err ) {
					next( err );
					return;
				}
			context.results = rows;
			res.json(context);
			//console.log(rows);
			console.log(context);
			});
		}
	});
});


app.get('/remove',function(req,res,next){
  var context = {};
  mysql.pool.query("delete from seeds WHERE id=? ",
    [req.query.id],
    function(err, result){
			console.log(result);
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.affectedRows + " rows.";
		console.log(context);
		res.send(JSO.stringify(context));
  });
});
*/

app.get('/random',function(req,res){
  res.render('random', getRandObj() );
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
