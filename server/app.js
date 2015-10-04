// Load the http module to create an http server.
var http = require('http');
var mysql = require("mysql");
var url = require("url");

var con = mysql.createConnection({
   host: "dbsiotdb.ctdx7umcipoo.us-west-2.rds.amazonaws.com",
   user: "dbs",
   password: "dbsatlanta",
   database: "iot"
 });

con.connect(function(err){
    if(err){
         console.log('Error ' + err);
         return;
    }
    console.log('Connection established');
 });

var server = http.createServer(function (request, response) {

    var html = '<html><body>';
  
    console.dir(request.param);

    var queryObject = url.parse(request.url,true).query;
    console.log(queryObject);

    if (queryObject['device'] == null) {
        console.log('Got nothing! ');

	con.query('SELECT * FROM cubestate;',function(err, rows){
		for(var i =0; i<rows.length; i++) {
			html += rows[i].name + ", ";
		}        
  	      	html += '</BODY></HTML>';
		response.writeHead(200, {'Content-Type': 'text/plain'});
        	response.end(html);
	});
    }
    else
    {
	var device = queryObject['device'];
	var state = queryObject['occupied']
	console.log(device + ', ' + state);
	con.query('INSERT INTO cubestate (deviceId, occupied, ts) VALUES (' + device + ',' + state + ', now());', function(err, result) {
		console.log("Err: " + err + ", Res: " + result);
	});
	response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('<HTML><BODY>Success!</BODY></HTML>');
    }
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8080);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8080/");
