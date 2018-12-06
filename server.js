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
  _users = data;		  
});

var _schedule = [];
fs.readFile( __dirname + "/" + "backend-data/schedule.json", 'utf8', function (err, data) {
  _schedule = data;		  
});

var _marks = [];
fs.readFile( __dirname + "/" + "backend-data/marks.json", 'utf8', function (err, data) {
  _marks = data;		  
});

function maxUID() {  
  var maxUid = 0;
  for (var i = 0; i < _users.length; i++) {
    if(parseInt(_users[i]) > maxUid){
	  maxUid = parseInt(_users[i]);
	}
  }
  return (maxUid + 1).toString();;  
}

function maxMarkID() {  
  var maxMarkID = 0;
  for (var i = 0; i < _marks.length; i++) {
    if(parseInt(_marks[i]) > maxMarkID){
	  maxMarkID = parseInt(_marks[i]);
	}
  }
  return (maxMarkID + 1).toString();;  
}

function maxLessonID() {  
  var maxLessonID = 0;
  for (var i = 0; i < _schedule.length; i++) {
    if(parseInt(_schedule[i]) > maxLessonID){
	  maxLessonID = parseInt(_schedule[i]);
	}
  }
  return (maxLessonID + 1).toString();;  
}

app.get('/groups', function (req, res) {	
  fs.readFile( __dirname + "/" + "backend-data/groups.json", 'utf8', function (err, data) {    
    res.end( data );
  });  
});

app.get('/subjects', function (req, res) {	
  fs.readFile( __dirname + "/" + "backend-data/subjects.json", 'utf8', function (err, data) {    
    res.end( data );
  });  
});

app.get('/listMarks', function (req, res) {
  res.end( _marks );   
});

app.get('/listUsers', function (req, res) {
  res.end( _users );   
});

app.get('/schedule', function (req, res) {	
  res.end( _schedule );   
});

app.get('/:id', function (req, res) {
  var users = JSON.parse(_users);  
  var user = users.find((user,i) => user.id === req.params.id);
  res.end(JSON.stringify(user));   
});

app.get('/lesson/:id', function (req, res) {
  var schedule = JSON.parse(_schedule);  
  var lesson = schedule.find((lesson,i) => lesson.id === req.params.id);
  res.end(JSON.stringify(lesson));   
});

app.get('/marksByLessonID/:id', function (req, res) {  
  var marks = JSON.parse(_marks); 
  var filteredMarks = marks.filter(mark => {
    return mark.lessonId === req.params.id;
  });    
  res.end(JSON.stringify(filteredMarks));   
});

app.post('/addUser', function (req, res) {   
  users = JSON.parse( _users );	  
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
  _users = JSON.stringify(users);	  
  res.end(JSON.stringify(users));   
});

app.post('/addMark', function (req, res) {   
  marks = JSON.parse( _marks );	  
  var mark = {
		  "id": maxMarkID(),
          "lessonId"  : req.body.lessonId,
          "teacherId"  : req.body.teacherId,
	      "studentId" : req.body.studentId,
	      "mark"  : req.body.mark		  
  }
  marks.push(mark);
  _marks = JSON.stringify(marks);	  
  res.end(JSON.stringify(marks));   
});

app.post('/addLesson', function (req, res) {   
  schedule = JSON.parse( _schedule );	  
  var lesson = {
	      "id"        : maxLessonID(),
          "date"      : req.body.date,
          "subject"   : req.body.subject,
	      "group"     : req.body.group,
	      "teacherId" : req.body.teacherId		    
  }
  schedule.push(lesson);
  _schedule = JSON.stringify(schedule);	  
  res.end(JSON.stringify(schedule));   
});

app.post('/authenticate', function (req, res) {   
  users = JSON.parse( _users );
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

app.put('/marks/:id', function (req, res) {   
  marks = JSON.parse( _marks );  
  for (var i = 0; i < marks.length; i++) {
    if(marks[i].id === req.params.id){
	  marks[i] = req.body;	  
	}
  }
  _marks = JSON.stringify(marks)  
  res.end(_marks);   
});

app.put('/schedule/:id', function (req, res) {   
  schedule = JSON.parse( _schedule );  
  for (var i = 0; i < schedule.length; i++) {
    if(schedule[i].id === req.params.id){
	  schedule[i] = req.body;	  
	}
  }
  _schedule = JSON.stringify(schedule)    
  res.end(_schedule);   
});

app.put('/users/:id', function (req, res) {   
  users = JSON.parse( _users );  
  for (var i = 0; i < users.length; i++) {
    if(users[i].id === req.params.id){
	  users[i] = req.body;	  
	}
  }
  _users = JSON.stringify(users)    
  res.end(_users);   
});

app.delete('/deleteUser/:id', function (req, res) {
  var users = JSON.parse(_users);
  users.splice(users.findIndex((item) => item.id === req.params.id), 1);	  
  _users = JSON.stringify(users);      
  res.end( JSON.stringify(users));   
});

app.delete('/deleteMark/:id', function (req, res) {
  var marks = JSON.parse(_marks);
  marks.splice(marks.findIndex((item) => item.id === req.params.id), 1);	  
  _marks = JSON.stringify(marks);      
  res.end( JSON.stringify(marks));   
});

app.delete('/deleteLesson/:id', function (req, res) {
  var schedule = JSON.parse(_schedule);
  var marks = JSON.parse(_marks);
  var filteredMarks = marks.filter(mark => {
    return mark.lessonId != req.params.id;
  }); 
  schedule.splice(schedule.findIndex((item) => item.id === req.params.id), 1);	    
  _schedule = JSON.stringify(schedule); 
  _marks = JSON.stringify(filteredMarks);   
  res.end( JSON.stringify(schedule));   
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});