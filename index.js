var Gpio = require('pigpio').Gpio,
motor = new Gpio(10, {mode: Gpio.OUTPUT});
var url = require('url');

// servo disk release point
var centerPoint = 1000;

// servo state
var currentLocation = 0;

// on run reset the servo
motor.servoWrite(currentLocation);



var button = new Gpio(4, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE
});

button.on('interrupt', function (level) {
  motor.servoWrite(centerPoint);
});

var http = require('http');
var port = 80;

var reqHand = function(req, res) {
  var queryData = url.parse(request.url, true).query;
  console.log(queryData);

  if(currentLocation <= centerPoint){
    currentLocation = centerPoint + 800;
  } else {
    currentLocation = centerPoint - 800;
  }

  if(currentLocation < 0){
    currentLocation = 0;
  } else if (currentLocation > 2000) {
    currentLocation = 2000;
  }

  if(queryData.pos){
    currentLocation = queryData.pos;
    console.log(queryData.pos);
  }

  motor.servoWrite(currentLocation);

  res.end('acknowledged commander!');
}

var server = http.createServer(reqHand);

server.listen(port, function(err){
  if(err){
    return console.log('uh oh! : ', err);
  }

  console.log('go chicken go');
});
