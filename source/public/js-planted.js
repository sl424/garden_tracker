 //Full texts		id	fid		name	do_best		date_planted	water		areai
var msg = document.getElementById('messages');

var input = ['bid', 'sid','date_planted'];
var ph = ['bid', 'sid','YYYY-MM-DD'];
var type = ['string', 'string', 'number'];

var newhead = ['bid', 'sid','date_planted','action'];
var fhead = ['bid', 'sid','date_planted',''];

var body = ['id','bid', 'sid','date_planted'];
var update = ['u-bid', 'u-sid','u-date_planted'];
var search = ['s-bid', 's-sid','s-date_planted'];
var numcols = 4;
//
// Following constructor were modified from editablegrid project
// source 
//
		//new DateCellValidator(), 
		//new NumberCellValidator("integer")
var valid = [ 
		new StringValidator(), 
		new StringValidator(), 
		new DateCellValidator()
		];

/****************************************
// Create New Item entry form in the 'userform' div section
// use 'newhead' id name
// create 'Add item' button
****************************************/
document.addEventListener('DOMContentLoaded', function(){
	var userdiv = document.getElementById('userinput');
	addForm( userdiv, newhead );
	var input = document.createElement('input');
	input.type = "submit";
	input.name = "Add Item";
	input.value = "Add Item";
	input.id = "addNew";
	document.getElementById('userform').appendChild(input);
});

/****************************************
// create generic input fields filled with 'row' or empty
// id = 'userform' or id = 'updateform'
// row data to populate the input fields
****************************************/
function addForm(divfield,head,row){
	var numcols = 3;
	var form = document.createElement('form');
	form.method = "post";
	if ( row )
		form.id = "updateform"
	else
		form.id = "userform";
	//form.setAttribute('method',"post");
	if ( row )
		var current = row.firstChild;
	for ( var i = 0; i < numcols; i++ ) {
		var input = document.createElement("input");

		if (head[i] == 'bid' || head[i] == 'u-bid') { 
			input = document.createElement("select");
			setOption(input, 'beds', row ? current.textContent : '');
		}
		if (head[i] == 'sid' || head[i] == 'u-sid') { 
			input = document.createElement("select");
			setOption(input, 'seeds', row ? current.textContent : '' );
		}

		//assign type to classname to format input width
		input.className = type[i];
		input.type = "text";
		input.id = head[i];
		input.placeholder = ph[i];
		//assign validator function to each input field
		input.check = valid[i];
		if (row) {
			input.value = current.textContent;
			current = current.nextSibling;
		}
		form.appendChild(input)
	}
	divfield.appendChild(form);
}

function setOption(el,tname,defaultval){
	var req = new XMLHttpRequest();
	req.open("GET", "http://52.36.73.75:3000/"+tname+"/all", true);
	req.setRequestHeader('Content-Type','application/json');
	req.addEventListener('load',function(){
		if ( req.status >= 200 && req.status < 400 ) {
			var xhr = JSON.parse(req.responseText);
			fillOptions(xhr);
		}
		else{ console.log('Error',+ req.statusText);
		var msg = document.getElementById('messages');
		msg.textContent = req.statusText;}
	});
	req.send(null);

	function fillOptions(xhr){
		if (defaultval){
			el.options.add( new Option(defaultval, defaultval) );
		}
		for ( var i = 0; i < xhr.results.length; i++ ) {
			el.options.add( new Option(xhr.results[i].name,xhr.results[i].name) );
		}
	}
}

/****************************************
// create table header and assign class name to each column
****************************************/
var cols = ['one','two','three','four'];
var numcols = 4;
var table = document.createElement('table');

var row = document.createElement('tr');
for( var i = 0; i < numcols; ++i ) {
	var cell = document.createElement('th');
	cell.textContent = newhead[i];
	cell.className = cols[i];
	row.appendChild(cell);
}
table.appendChild(row);

var row2 = document.createElement('tr');
for( var i = 0; i < numcols-1; ++i ) {
	var cell = document.createElement('th');
	var input = document.createElement('input');
	input.id = search[i];
	input.placeholder = 'filter '+fhead[i];
	input.setAttribute('type', 'text');
	input.setAttribute('width','100%');
	input.onkeypress = function (e) {searchButton(e);};
	cell.appendChild(input);
	row2.appendChild(cell);
}
table.appendChild(row2);

function searchButton(e){
	if (e.keyCode == 13) {
	var req = new XMLHttpRequest();
	var payload = {
		"bid":document.getElementById("s-bid").value,
		"sid":document.getElementById("s-sid").value,
		"date_planted":document.getElementById("s-date_planted").value
	};
	req.open('POST', "http://52.36.73.75:3000/planted/all", true);
	//req.open('POST', "http://httpbin.org/post", true);
	req.setRequestHeader('Content-Type','application/json');
	req.addEventListener('load',function(){
		if ( req.status >= 200 && req.status < 400 ) {
			var xhr = JSON.parse(req.responseText);
			//refreshRow(xhr);
			filterRow(xhr);
			console.log("search result: ", xhr);
			var msg = document.getElementById('messages');
			msg.textContent = "search succesful";
		}
		else{ console.log('Error',+ req.statusText);
			var msg = document.getElementById('messages');
			msg.textContent = req.statusText;
		}
	});
	req.send( JSON.stringify(payload) );
	};
}

function filterRow(xhr){
		var set = [];
		for ( var i = 0; i < xhr.results.length; i++ ) {
			set.push(xhr.results[i].id+'');
		}
		console.log(set);
		console.log(xhr.results);
		console.log('hello');

	var els = document.getElementsByClassName('data');
	console.log(els.length);
	for (var i = 0; i < els.length; i++) {
		//if (els[i].getAttribute('id') in set){
		if (set.indexOf(els[i].getAttribute('id')) > -1){
			els[i].style.display = '';
			//console.log(els[i].getAttribute('id'));
		} else {
			console.log(els[i].getAttribute('id'));
			els[i].style.display = 'none';
		}
	}
}



/****************************************
 * async call to retrive data from server
 * and populate the table
****************************************/
document.addEventListener('DOMContentLoaded', bindButton);
function bindButton(){
	var req = new XMLHttpRequest();
	//var payload = {};
	req.open("GET", "http://52.36.73.75:3000/planted/all", true);
	req.setRequestHeader('Content-Type','application/json');
	req.addEventListener('load',function(){
		if ( req.status >= 200 && req.status < 400 ) {
			var xhr = JSON.parse(req.responseText);
			//console.log(xhr);
			addRow(xhr);
			var msg = document.getElementById('messages');
			msg.textContent = "loaded";
		}
		else{ console.log('Error',+ req.statusText);
		var msg = document.getElementById('messages');
		msg.textContent = req.statusText;}
	});
	req.send(null);
	//req.send( JSON.stringify(payload) );
};

/****************************************
 * create each row elements
****************************************/
function addRow(xhr){
	for ( var i = 0; i < xhr.results.length; i++ ) {
		var row = document.createElement('tr');
		row.className = 'data';
		row.setAttribute('id',xhr.results[i].id);

		var bid = document.createElement('td');
		bid.textContent = xhr.results[i].bid;
		row.appendChild(bid);

		var sid = document.createElement('td');
		sid.textContent = xhr.results[i].sid;
		row.appendChild(sid);

		var date_planted = document.createElement('td');
		date_planted.textContent = xhr.results[i].date_planted.slice(0,10);
		row.appendChild(date_planted);

		// delete button, edit button, hidden key forms
		var dcell = document.createElement('td');
		var form = document.createElement('form');
		var button = document.createElement('button');
		button.textContent = "X";
		form.appendChild(button);
		var button2 = document.createElement('button');
		button2.textContent = "edit";
		form.appendChild(button2);
		var key = document.createElement('input');
		key.type = "hidden";
		key.value = xhr.results[i].id;
		form.appendChild(key);
		dcell.appendChild(form);
		row.appendChild(dcell);
		// add to table but also attach event function to buttons
		table.appendChild(row);
		button.addEventListener('click', function(e) {removeRow(e);});
		button2.addEventListener('click',function(e){ createForm(e);});
	}
	document.getElementById("tablecontent").appendChild(table);
}


/****************************************
 * Create form for editing data in the 'update' section
 * only one edit at the same time, remove if needed
 * retrieve row id data to the "update' button
****************************************/
function createForm(event){
	var updatediv = document.getElementById('update');
	if ( updatediv.firstChild ){
		updatediv.removeChild(updatediv.firstChild);
	}
	var row = event.target.parentNode.parentNode.parentNode;
	console.log(row);
	addForm( updatediv, update, row );
	var input = document.createElement('input');
	input.type = "submit";
	input.name = "Update";
	input.value = "Update";
	//input.id = "updateRow";
	input.id = event.target.parentNode.lastChild.value;
	var msg = document.getElementById('messages');
	msg.textContent = "Fill in the change and click update";
	//console.log(input.id);
	input.addEventListener('click', function(e) {updateRow(e)});
	updatediv.firstChild.appendChild(input);
	event.preventDefault();
}

/****************************************
 * async POST call, update the server
 * retrieve new data and refresh row data
****************************************/
function updateRow(e){
	var id = e.target.getAttribute('id');
	//console.log("updating row id: ",id);
	if ( updateCheck() ) {
		var msg = document.getElementById('messages');
		msg.textContent = "error, invalid input";
	}
	else{
	var req = new XMLHttpRequest();
	var payload = {
		"id":id,
		"bid":document.getElementById("u-bid").value,
		"sid":document.getElementById("u-sid").value,
		"date_planted":document.getElementById("u-date_planted").value
	};
	req.open('PUT', "http://52.36.73.75:3000/planted/"+payload.id, true);
	//req.open('POST', "http://httpbin.org/post", true);
	req.setRequestHeader('Content-Type','application/json');
	req.addEventListener('load',function(){
		if ( req.status >= 200 && req.status < 400 ) {
			var xhr = JSON.parse(req.responseText);
			refreshRow(xhr);
			console.log("updated result: ", xhr);
			var msg = document.getElementById('messages');
			msg.textContent = "Update succesful";
		}
		else{ console.log('Error',+ req.statusText);
			var msg = document.getElementById('messages');
			msg.textContent = req.statusText;
		}
	});
	req.send( JSON.stringify(payload) );
	}
	e.preventDefault();
}


	//current.textContent = xhr.results[0].date.slice(0,10);
/****************************************
 * Update row content
****************************************/
function refreshRow( xhr ) {
	console.log(xhr.results);
	var id = xhr.results[0].id;
	var row = document.getElementById(id);
	//console.log(row);
	var current = row.firstChild;
	current.textContent = xhr.results[0].bid;
	current = current.nextSibling;
	current.textContent = xhr.results[0].sid;
	current = current.nextSibling;
	current.textContent = xhr.results[0].date_planted.slice(0,10);
	//remove update form
	var updatediv = document.getElementById('update');
	if ( updatediv.firstChild ){
		updatediv.removeChild(updatediv.firstChild);
	}
}


/****************************************
 * async GET call to remove data 
 * from server and from the table
****************************************/
function removeRow(event) {
	var target = event.target;
	var row = target.parentNode.parentNode.parentNode;
	var table = target.parentNode.parentNode.parentNode.parentNode;
	var id = row.getAttribute('id');
	//console.log("removing row id: ",id);
	var req = new XMLHttpRequest();
	req.open('DELETE', "http://52.36.73.75:3000/planted/"+id, true);
	req.addEventListener('load',function(){
					if ( req.status >= 200 && req.status < 400 ) {
						var xhr = JSON.parse(req.responseText);
						//console.log(xhr);
						if ( xhr.results ){
							table.removeChild(row);
							var msg = document.getElementById('messages');
							msg.textContent = "Item removed";
						}
					}
					else{ console.log('Error',+ req.statusText);
						var msg = document.getElementById('messages');
						msg.textContent = req.statusText;
					}
	});
	req.send(null);
	event.preventDefault();
}

function updateCheck(){
				var c = document.getElementById("u-bid");
				var d = document.getElementById("u-sid");
				var g = document.getElementById("u-date_planted");
				//if ( !document.getElementById("name").value ) {
				//if ( !c.check.isValid(c.value)) {
				if ( !c.check.isValid(c.value) || 
						!d.check.isValid(d.value) || 
						!g.check.isValid(g.value) ) {
							return 1;
						}
				return 0;
}

function addCheck(){
				var c = document.getElementById("bid");
				var d = document.getElementById("sid");
				var g = document.getElementById("date_planted");
				//if ( !document.getElementById("name").value ) {
				//if ( !c.check.isValid(c.value)) {
				if ( !c.check.isValid(c.value) || 
						!d.check.isValid(d.value) || 
						!g.check.isValid(g.value) ) {
							return 1;
						}
				return 0;
}


/****************************************
 * async POST call to add
****************************************/
document.addEventListener('DOMContentLoaded', bindPost);
function bindPost(){
	document.getElementById('addNew').addEventListener('click', 
			function(event){
				if ( addCheck() ) {
					var msg = document.getElementById('messages');
					msg.textContent = "error, invalid input";
				}
				else{
					var req = new XMLHttpRequest();

					var payload = {
						"bid":document.getElementById("bid").value,
						"sid":document.getElementById("sid").value,
						"date_planted":document.getElementById("date_planted").value
					};

					//console.log(payload);
					req.open('POST', "http://52.36.73.75:3000/planted", true);
					//req.open('POST', "http://httpbin.org/post", true);
					req.setRequestHeader('Content-Type','application/json');
					req.addEventListener('load',function(){
						if ( req.status >= 200 && req.status < 400 ) {
							var xhr = JSON.parse(req.responseText);
							addRow(xhr);
							var msg = document.getElementById('messages');
							msg.textContent = "Item added to database";
							clearInput();
							//console.log(xhr);
						}
						else{ console.log('Error',+ req.statusText);
							var msg = document.getElementById('messages');
							msg.textContent = req.statusText;
						}
					});
					req.send( JSON.stringify(payload) );
				}
				event.preventDefault();
			});
};

function clearInput() {
  var input = ['bid', 'sid','date_planted'];
	input.forEach( function(form) {
		document.getElementById(form).value = "";
	});
}



