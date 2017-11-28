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
app.get('/',function(req,res){
  res.render('garden');
});

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
	mysql.pool.query('INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) values (?,?,?,?,?)', 
		[req.body.name, req.body.reps,req.body.weight, req.body.date, req.body.lbs ], 
		function(err, result){
		if ( err ) {
			next( err );
			return;
		}
		if ( result.affectedRows ){
			mysql.pool.query( 'SELECT * FROM workouts WHERE id=?',
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


app.get('/remove',function(req,res,next){
  var context = {};
  mysql.pool.query("delete from workouts WHERE id=? ",
    [req.query.id],
    function(err, result){
			console.log(result);
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.affectedRows + " rows.";
		console.log(context);
		res.send(JSON.stringify(context));
  });
});


app.post('/update',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE seeds SET fid=?, name=?, do_best=?, sunlight=?, water=?, area=? WHERE id=? ",
		[req.body.fid, req.body.name, req.body.do_best, req.body.sunlight, req.body.water, req.body.area, req.body.id ], 
    function(err, result){
    if(err){
      next(err);
      return;
    }
		if ( result.affectedRows ){
			mysql.pool.query( 'SELECT * FROM workouts WHERE id=?',
				[req.body.id],
				function(err, rows, fields){
				if ( err ) {
					next( err );
					return;
				}
			context.results = rows;
			res.json(context);
			console.log(rows);
			});
		}
  });
});


/*
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
    var createString = "CREATE TABLE todo(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "done BOOLEAN," +
    "due DATE)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('test',context);
    })
  });
});
*/

/*
app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO todo (`name`) VALUES (?)", [req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('test',context);
  });
});

app.get('/show',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    //context.results = JSON.stringify(rows);
    context.results = rows;
    res.render('test', context);
  });
});

app.get('/simple-update',function(req,res,next){
  var context = {};
  mysql.pool.query("UPDATE todo SET name=?, done=?, due=? WHERE id=? ",
    [req.query.name, req.query.done, req.query.due, req.query.id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Updated " + result.changedRows + " rows.";
    res.render('home',context);
  });
});

app.get('/safe-update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM todo WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE todo SET name=?, done=?, due=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.done || curVals.done, req.query.due || curVals.due, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('test',context);
      });
    }
  });
});


app.get('/delete',function(req,res,next){
  var context = {};
  mysql.pool.query("delete from todo WHERE id=? ",
    [req.query.id],
    function(err, result){
			console.log(result);
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.affectedRows + " rows.";
    res.render('home',context);
  });
});



app.get('/double',function(req,res,next){
  var context = {};
  request("http://api.opencagedata.com/geocode/v1/json?query="+city+","+state+"&pretty=1&key="+appID, function(error, response, body) {
  if ( !error && response.statusCode < 400 ) {
  context.site1 = body;
  request("http://api.open-notify.org/iss-now.json?",
  function(error, response, body) {
  if ( !error && response.statusCode < 400 ) {
  context.site2 = body;
  res.render('test',context);
  }
  else{
  console.log(error);
  if ( response)
  next(error);
  }
  });
  }
  else{
  console.log(error);
  if ( response )
  console.log(response);
  next(error);
  }
  });
});
//next request


app.get('/',function(req,res,next){
  var context = {};
  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('newSession', context);
    return;
  }
  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length || 0;
  context.toDo = req.session.toDo || [];
  console.log(context.toDo);
  context.name = req.query.name;
  res.render('toDo',context);
});


app.post('/',function(req,res){
  var context = {};

  if(req.body['New List']){
    req.session.name = req.body.name;
    req.session.toDo = [];
    req.session.curId = 0;
  }

  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('newSession', context);
    return;
  }
  if(req.body['Add Item']){
    req.session.toDo.push({
    "name":req.body.name, 
    "city":req.body.city,
    "temp":req.body.temp,
    "id":req.session.curId});
    req.session.curId++;
  }


  if(req.body['Done']){
    req.session.toDo = req.session.toDo.filter(function(e){
      return e.id != req.body.id;
    })
  }

  let request = req.session.toDo.map((item) => {
    return new Promise((resolve) => {
      checkState(item, resolve);
    });
  });
  Promise.all(request).then(() => {
  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length;
  context.toDo = req.session.toDo;
  console.log(context.toDo);
  res.render('toDo',context);
  });
});

function checkState(item,resolve){
  var appendUnit = "&units=imperial";
  request("http://api.openweathermap.org/data/2.5/weather?zip="+item.city+",us&appid="+owaID+appendUnit, function(err, response, body){
    if ( !err && response.statusCode < 400 ){
      var result = JSON.parse(body).main.temp;
      if ( result >= item.temp ){
        item.className = "OK";
	}
    }
    else{
      console.log(err);
      if ( response )
        console.log(response);
      next(err);
    }
    resolve();
  });
}
/*

app.get('/forms',function(req,res){
  var queryList = [];
  for ( var pair in req.query ) {
    queryList.push({'key':pair, 'value':req.query[pair]});
  }
  var queryObject = {'queryType':'GET', 'queryList':queryList};
  res.render('forms', queryObject);
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/forms', function(req,res){
  var queryList = [];
  for ( var pair in req.body ) {
    queryList.push({'key':pair, 'value':req.body[pair]});
  }
console.log(req.body);
console.log(queryList);
  var queryObject = {'queryType':'POST', 'queryList':queryList};
  res.render('forms', queryObject);
});
*/

var min = 0;
var max = 100;

function getRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandObj(){
  var number = {'number':getRand(min,max)};
  return number;
}

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
