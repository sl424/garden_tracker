module.exports = function(){
	var express = require('express');
	var router = express.Router(); 
	var mysql = require('./connection.js');

	function getID_beds(context, name,complete){
		mysql.pool.query( 'SELECT * FROM beds WHERE name=?', [name],
				function(err, rows, fields){
					if ( err ) {
						res.status(400);
						res.write(JSON.stringify(err));                              
						res.end();                                                     
					}
					if (rows[0]) { context.beds = rows[0].id; } else {context.beds='NULL';}
					complete();
				});
	}

	function getID_seeds(context, name,complete){
		mysql.pool.query( 'SELECT * FROM seeds WHERE name=?', [name],
				function(err, rows, fields){
					if ( err ) {
						res.status(400);
						res.write(JSON.stringify(err));                              
						res.end();                                                     
					}
					if (rows[0]){ context.seeds = rows[0].id; } else {context.seeds='NULL';}
					complete();
				});
	}

	function getPlanted(res, context, complete,id){
		mysql.pool.query('SELECT p.id, b.name as bid, s.name as sid, date_planted FROM planted p INNER JOIN beds b ON p.bid=b.id INNER JOIN seeds s ON p.sid=s.id WHERE p.id='+id,
				function(err, rows, fields){
			if(err){                                                         
				res.status(400);
				res.write(JSON.stringify(err));                              
				res.end();                                                     
			}                                                                  
			context.results  = rows;
			complete();                                                                                                                                                                        
		}); 
	}

	function getPlanteds(res, context, complete){
		/*
		var sqlstm = 'SELECT s.id, s.name, f.name as fid, m.name as do_best, s.sunlight, s.water, s.area FROM seeds s INNER JOIN family f ON s.fid=f.id INNER JOIN month m ON s.do_best=m.id';
		mysql.pool.query(sqlstm,
		*/
		mysql.pool.query('SELECT p.id, b.name as bid, s.name as sid, date_planted FROM planted p INNER JOIN beds b ON p.bid=b.id INNER JOIN seeds s ON p.sid=s.id',
				function(err, rows, fields){
			if(err){                                                         
				res.status(400);
				res.write(JSON.stringify(err));                              
				res.end();                                                     
			}                                                                  
			context.results  = rows;
			complete();
		}); 
	}

	function joinstm(sqlstm, req, fin){
		var flag = 0;
		for (k in req.body){
			if (req.body[k]) {flag=1};
		}
		
		if (flag){
		sqlstm += ' WHERE ';
		for (k in req.body){
			if (req.body[k]) { sqlstm += k+'="'+req.body[k]+'" AND ';};
		}
		sqlstm = sqlstm.slice(0,-5);
		}
		//console.log(sqlstm);
		fin(sqlstm);
	}

	function postPlanteds(res, req, context, complete){
		var sqlstm = 'select * from (SELECT p.id, b.name as bid, s.name as sid, date_planted FROM planted p INNER JOIN beds b ON p.bid=b.id INNER JOIN seeds s ON p.sid=s.id) as tmp1';
		joinstm(sqlstm, req, fin);
		function fin(sqlstm2){
			//console.log(sqlstm2);
			mysql.pool.query(sqlstm2,
					function(err, rows, fields){
						if(err){                                                         
							res.status(400);
							res.write(JSON.stringify(err));                              
							res.end();                                                     
						}else{
						//console.log(rows);
						context.results  = rows;
						complete();
						}
					}); 
		}
	}

	function addPlanteds(res,req,context, complete){
		var c = {};
		var cc=0;
		getID_beds(c, req.body.bid, complete2);
		getID_seeds(c, req.body.sid, complete2);
		function complete2(){
			cc++;
			if (cc >=2){ console.log(c); 
		mysql.pool.query('INSERT INTO planted (`bid`,`sid`,`date_planted`) values (?,?,?)', 
				[c.beds, c.seeds, req.body.date_planted], 
				function(err, result){
					if ( err ) {
						res.status(400);
						res.write(JSON.stringify(err));                              
						res.end();                                                     
					}
					else if ( result.affectedRows ){
							 getPlanted(res,context,complete,result.insertId);
					}
				});
	} }}

	function updatePlanteds(res, req, context, fin,id){
		var c = {};
		var cc=0;
		getID_beds(c, req.body.bid, complete2);
		getID_seeds(c, req.body.sid, complete2);
		function complete2(){
			cc++;
			if (cc >=2){ console.log(c); 

				mysql.pool.query("UPDATE planted SET bid=?, sid=?, date_planted=? WHERE id=? ",
						[c.beds, c.seeds, req.body.date_planted, req.body.id], 
						function(err, result){
							if(err){ 
						res.status(400);
						res.write(JSON.stringify(err));                              
						res.end();                                                     
							}
							else if ( result.affectedRows ){
							 getPlanted(res,context,fin,id);
								/*
								mysql.pool.query( 'SELECT * FROM seeds WHERE id=?', [id],
									function(err, rows, fields){ if ( err ) { next( err ); return; }
										context.results = rows;
										//console.log(context);
										fin();
									});
								*/
							} 
						});

			}
		}
	}

router.get('/',function(req,res){
	var context = {};
	context.jsscript = "js-planted.js";
	context.header = 'planted history';
  res.render('table',context);
});

router.get('/all',function(req, res,next){
	var context= {};
	getPlanteds(res, context, complete);
	function complete(){
    //res.render('garden', context);
		res.json(context);
	}
});
	//mysql.pool.query('INSERT INTO workouts (name,reps,weight,date,lbs) values (?)', 

router.post('/all',function(req, res,next){
	var context= {};
	postPlanteds(res, req, context, complete);
	function complete(){
    //res.render('garden', context);
		res.json(context);
	}
});
	//mysql.pool.query('INSERT INTO workouts (name,reps,weight,date,lbs) values (?)', 

router.post('/',function(req,res,next){
  var context = {};
	addPlanteds(res,req, context, complete);
	function complete(){
		res.json(context);
	}
});

router.put('/:id',function(req,res,next){
  var context = {};
	var cb = 0;
	updatePlanteds(res, req, context, complete,req.params.id);
	function complete(){
		res.json(context);
	}
});


router.delete('/:id',function(req,res,next){
  var context = {};
  mysql.pool.query("delete from planted WHERE id=? ",
    [req.params.id],
    function(err, result){
			console.log(result);
    if(err){
						res.status(400);
						res.write(JSON.stringify(err));                              
						res.end();                                                     
    }
    context.results = "Deleted " + result.affectedRows + " rows.";
		console.log(context);
		res.send(JSON.stringify(context));
		});
});

return router;                                                                                                                                                                             
}();
