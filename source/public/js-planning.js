 //Full texts		id	fid		name	do_best		sunlight	water		areai
var msg = document.getElementById('messages');

var input = ['bid', 'mid','sunlight'];
var ph = ['bid', 'mid','sunlight-hrs'];
var type = ['string', 'string', 'number'];

var newhead = ['bid', 'mid','seeds', 'family','action'];
var fhead = ['bid', 'mid','seeds', 'family',''];

//var body = ['id','bid', 'mid','sunlight'];
var update = ['u-bid', 'u-mid','u-sunlight'];
var search = ['s-bid', 's-mid','s-seeds', 's-family'];
var numcols = 5;
//
// Following constructor were modified from editablegrid project
// source 
//
		//new DateCellValidator(), 
		//new NumberCellValidator("integer")
var valid = [ 
		new StringValidator(), 
		new StringValidator(), 
		new NumberCellValidator("integer")
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
	userdiv.style.visibility="hidden";
	//document.getElementById(id).style.visibility = "hidden";
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

/****************************************
// create table header and assign class name to each column
****************************************/
var cols = ['one','two','three','four','five'];
var numcols = 5;
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
		"mid":document.getElementById("s-mid").value,
		"seeds":document.getElementById("s-seeds").value,
		"family":document.getElementById("s-family").value,
	};
	req.open('POST', "http://52.36.73.75:3000/planning/all", true);
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
	req.open("GET", "http://52.36.73.75:3000/planning/all", true);
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

		var mid = document.createElement('td');
		mid.textContent = xhr.results[i].mid;
		row.appendChild(mid);

		var seeds = document.createElement('td');
		seeds.textContent = xhr.results[i].seeds;
		row.appendChild(seeds);

		var family = document.createElement('td');
		family.textContent = xhr.results[i].family;
		row.appendChild(family);


		// delete button, edit button, hidden key forms
		var dcell = document.createElement('td');
		dcell.style.visibility="hidden";
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
		"mid":document.getElementById("u-mid").value,
		"sunlight":document.getElementById("u-sunlight").value
	};
	req.open('PUT', "http://52.36.73.75:3000/affects/"+payload.id, true);
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
	current.textContent = xhr.results[0].mid;
	current = current.nextSibling;
	current.textContent = xhr.results[0].sunlight;
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
	req.open('DELETE', "http://52.36.73.75:3000/affects/"+id, true);
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
				var d = document.getElementById("u-mid");
				var g = document.getElementById("u-sunlight");
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
				var d = document.getElementById("mid");
				var g = document.getElementById("sunlight");
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
						"mid":document.getElementById("mid").value,
						"sunlight":document.getElementById("sunlight").value
					};

					//console.log(payload);
					req.open('POST', "http://52.36.73.75:3000/affects", true);
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
  var input = ['bid', 'mid','sunlight'];
	input.forEach( function(form) {
		document.getElementById(form).value = "";
	});
}



