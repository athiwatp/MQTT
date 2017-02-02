var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://oodebe.com:10011')
var express = require('express')
var app = express();
var router = express.Router();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var status = 'off';
const port = 10012;

client.on('connect', function () {
  client.subscribe('switch')
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message);
  let msg = JSON.parse(message.toString());
  console.log(msg);
  io.emit('switch status',msg);
  //client.end()
});

router.get('/',function(req,res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log("Connected to Socket");
});

setInterval(function () {
  console.log('here');
  var _id = Math.floor((Math.random() * 4) + 1);
  if(status === 'off') {
    status = 'on';
  } else {
    status = 'off';
  }
  var message = '{"id":'+_id+',"status": "'+status+'"}';
  client.publish('switch', message)
}, 6000);

app.use('/',router);

http.listen(port,function(){
    console.log("Listening on ",port);
});
