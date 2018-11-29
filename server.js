var express = require('express');
var cors = require('cors')
var bodyParser  = require('body-parser');
var app = express();

app.use(cors());
app.use(bodyParser.json({
  extended: true
}));

var fs = require("fs");

var _users = []
fs.readFile( __dirname + "/" + "backend-data/users.json", 'utf8', function (err, data) {
  this._users = data;		  
});

app.get('/listUsers', function (req, res) {
  res.end( this._users );   
})

app.get('/:id', function (req, res) {
  var users = JSON.parse(this._users);  
  var user = users.find((user,i) => user.id === req.params.id);
  res.end(JSON.stringify(user));   
})

app.post('/addUser', function (req, res) {   
  users = JSON.parse( this._users );	  
  var user = {
		  "id": "5",
          "username" : req.body.username,
          "password" : req.body.password,
	      "firstName" : req.body.firstName,
	      "lastName" : req.body.lastName		  
  }
  users.push(user);
  this._users = JSON.stringify(users);	  
  res.end( JSON.stringify(users));   
})

app.delete('/deleteUser/:id', function (req, res) {
  var users = JSON.parse(this._users);
  users.splice(users.findIndex((item) => item.id === req.params.id), 1);	  
  this._users = JSON.stringify(users);      
  res.end( JSON.stringify(users));   
})

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})