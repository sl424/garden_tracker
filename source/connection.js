	var mysql = require('mysql');	
	var pool = mysql.createPool({
		host: 'localhost',
		user : 'student' ,
		password : 'default',
		database : 'cs340',
	})
	/*
	var pool = mysql.createPool({
		host: 'classmysql.engr.oregonstate.edu',
		user : 'cs340_linsh' ,
		password : '7081',
		database : 'cs340_lish',
	})
	*/

module.exports = {
	pool
}
