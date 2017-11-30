module.exports = function(){
	var express = require('express');
	var router = express.Router(); 
	var mysql = require('./connection.js');

	function getFamily(res, context, complete, id){
		mysql.pool.query('SELECT * FROM family b' + ' WHERE b.id='+id,
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

	function getFamilys(res, context, complete){
		var sqlstm = 'SELECT * FROM family b';
		mysql.pool.query(sqlstm,
				function(err, rows, fields){
			if(err){                                                         
				res.status(400);
				res.write(JSON.stringify(err));                              
				res.end();                                                     
			}                                                                  
			context.results  = rows
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

	function postFamilys(res, req, context, complete){
		var sqlstm = 'select * from family ';
		joinstm(sqlstm, req, fin);
		function fin(sqlstm2){
			console.log(sqlstm2);
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

	function addFamilys(res,req,context, complete){
		mysql.pool.query('INSERT INTO family (`name`,`alias`) values (?,?)', 
				[req.body.name,req.body.alias],
				function(err, result){
					if ( err ) {
						res.status(400);
						res.write(JSON.stringify(err));                              
						res.end();                                                     
					}
					else if ( result.affectedRows ){
							 getFamily(res,context,complete,result.insertId);
							 /*
						mysql.pool.query( 'SELECT * FROM family WHERE id=?',
							[result.insertId],
							function(err, rows, fields){
								if ( err ) {
									next( err );
									return;
								}
								context.results = rows;
								complete();
								//console.log(rows);
							});
						*/
					}
				});
	}

	function updateFamilys(res, req, context, fin,id){
				mysql.pool.query("UPDATE family SET name=?, alias=? WHERE id=? ",
						[req.body.name, req.body.alias, req.body.id],
						function(err, result){
							if(err){ 
						res.status(400);
						res.write(JSON.stringify(err));                              
						res.end();                                                     
							}
							else if ( result.affectedRows ){
							 getFamily(res,context,fin,id);
							} 
						});

			}

router.get('/',function(req,res){
	var context = {};
	context.jsscript = "js-family.js";
	context.header = 'family collection';
  res.render('table',context);
});

router.get('/all',function(req, res,next){
	var context= {};
	getFamilys(res, context, complete);
	function complete(){
    //res.render('garden', context);
		res.json(context);
	}
});
	//mysql.pool.query('INSERT INTO workouts (name,reps,weight,date,lbs) values (?)', 

router.post('/all',function(req, res,next){
	var context= {};
	postFamilys(res, req, context, complete);
	function complete(){
    //res.render('garden', context);
		res.json(context);
	}
});
	//mysql.pool.query('INSERT INTO workouts (name,reps,weight,date,lbs) values (?)', 

router.post('/',function(req,res,next){
  var context = {};
	addFamilys(res,req, context, complete);
	function complete(){
		res.json(context);
	}
});

router.put('/:id',function(req,res,next){
  var context = {};
	var cb = 0;
	updateFamilys(res, req, context, complete,req.params.id);
	function complete(){
		res.json(context);
	}
});


router.delete('/:id',function(req,res,next){
  var context = {};
  mysql.pool.query("delete from family WHERE id=? ",
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
