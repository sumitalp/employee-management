var fs = require('fs');
var db_helper = require("./db_helper.js");

var http = require('http').createServer(function handler(req, res) {
  fs.readFile(__dirname + '/index.html', function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
}).listen(1337);

var io = require('socket.io').listen(http);
io.sockets.on('connection', function(client) {
  console.log('Client connected'); 

  // populate employees on client
  db_helper.get_employees(function(employees) {
    client.emit('populate', employees);
  });
  
  // client add new employee
  client.on('add employee', function(data) {
    // create employee, when its done repopulate employees on client
    db_helper.add_employee(data, function(lastId) {
      // repopulate employees on client
      db_helper.get_employees(function(employees) {
        client.emit('populate', employees);
      });
    });
  });
  
  // client update employee
  client.on('update employee', function(data) {
    // create employee, when its done repopulate employees on client
    db_helper.edit_employee(data, function(lastId) {
      // repopulate employees on client
      db_helper.get_employees(function(employees) {
        client.emit('populate', employees);
      });
    });
  });
  
  // client add new employee
  client.on('get employee by id', function(data) { //console.log(data);
    // create employee, when its done repopulate employees on client
    db_helper.get_employee_by_id(data, function(employee) {
      client.emit('get_employee', employee);
	  //console.log(employee);
    });
  });
});









