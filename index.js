var Gpio = require('pigpio').Gpio,
motor = new Gpio(10, {mode: Gpio.OUTPUT});
var url = require('url');

// servo disk release point
centerPoint = 1000;

// servo state
currentLocation = 500;

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
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    console.log('favicon requested');
    return;
  }

  var queryData = url.parse(req.url, true).query;
  console.log(queryData);

  if(currentLocation >= centerPoint){
    currentLocation = 500;
  } else if (currentLocation < centerPoint) {
    currentLocation = 2000;
  }

  if(queryData.pos){
    currentLocation = queryData.pos;
    console.log(queryData.pos);
  }
  console.log(currentLocation);
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
