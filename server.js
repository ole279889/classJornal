var express = require('express');
var cors = require('cors')
var bodyParser  = require('body-parser');
var app = express();

app.use(cors());
app.use(bodyParser.json({
  extended: true
}));

var fs = require("fs");

var _users = [];
fs.readFile( __dirname + "/" + "backend-data/users.json", 'utf8', function (err, data) {
  this._users = data;		  
});

var _schedule = [];
fs.readFile( __dirname + "/" + "backend-data/schedule.json", 'utf8', function (err, data) {
  this._schedule = data;		  
});

function maxUID() {  
  var maxUid = 0;
  for (var i = 0; i < this._users.length; i++) {
    if(parseInt(this._users[i]) > maxUid){
	  maxUid = parseInt(this._users[i]);
	}
  }
  return (maxUid + 1).toString();;  
}
//------------------------groups----------------------------
app.get('/groups', function (req, res) {	
  fs.readFile( __dirname + "/" + "backend-data/groups.json", 'utf8', function (err, data) {    
    res.end( data );
  });  
});
//------------------------groups----------------------------
//------------------------subjects----------------------------
app.get('/subjects', function (req, res) {	
  fs.readFile( __dirname + "/" + "backend-data/subjects.json", 'utf8', function (err, data) {    
    res.end( data );
  });  
});
//------------------------subjects----------------------------
//------------------------users&schedule-----------------------------
app.get('/listUsers', function (req, res) {
  res.end( this._users );   
});

app.get('/schedule', function (req, res) {	
  res.end( this._schedule );   
});

app.get('/:id', function (req, res) {
  var users = JSON.parse(this._users);  
  var user = users.find((user,i) => user.id === req.params.id);
  res.end(JSON.stringify(user));   
});

app.post('/addUser', function (req, res) {   
  users = JSON.parse( this._users );	  
  var user = {
		  "id": maxUID(),
          "username"  : req.body.username,
          "password"  : req.body.password,
	      "firstName" : req.body.firstName,
	      "lastName"  : req.body.lastName,
          "role"	  : req.body.role,
	      "group"     : req.body.group		  
  }
  users.push(user);
  this._users = JSON.stringify(users);	  
  res.end(JSON.stringify(users));   
});

app.post('/authenticate', function (req, res) {   
  users = JSON.parse( this._users );
  var filteredUsers = users.filter(user => {
    return user.username === req.body.username && user.password === req.body.password;
  });  
  if (filteredUsers.length > 0) {
    var user = filteredUsers[0]; 
    var body = {
		         id: user.id,
                 username  : user.username,
                 password  : user.password,
	             firstName : user.firstName,
	             lastName  : user.lastName,
                 role	   : user.role,
	             group     : user.group,
                 token: "fake-jwt-token"		  
               }  
    res.end(JSON.stringify(body));
  } else {
    res.status(403).send("Authorization failed! Username or password is incorrect."); 
  } 
});

app.delete('/deleteUser/:id', function (req, res) {
  var users = JSON.parse(this._users);
  users.splice(users.findIndex((item) => item.id === req.params.id), 1);	  
  this._users = JSON.stringify(users);      
  res.end( JSON.stringify(users));   
});
//------------------------users-----------------------------
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});