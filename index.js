var Gpio = require('pigpio').Gpio,
  motor = new Gpio(10, {mode: Gpio.OUTPUT}),
  pulseWidth = 1000,
  increment = 10;

var button = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  });

button.on('interrupt', function (level) {
  motor.servoWrite(pulseWidth);
  pulseWidth += increment;
	  if (pulseWidth >= 2000) {
	    increment = -10;
	  } else if (pulseWidth <= 1000) {
	    increment = 10;
  	}
});

var http = require('http');
var port = 80;

var reqHand = function(req, res) {
setInterval(function () {
  motor.servoWrite(pulseWidth);

  pulseWidth += increment;
  if (pulseWidth >= 2000) {
    increment = -10;
  } else if (pulseWidth <= 1000) {
    increment = 10;
  }
}, 10);

	res.end('acknowledged commander!');
}

var server = http.createServer(reqHand);

server.listen(port, function(err){
	if(err){
		return console.log('uh oh! : ', err);
	}

	console.log('go chicken go');
});
