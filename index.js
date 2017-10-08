var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var ip = require("ip");
var Gpio = require('pigpio').Gpio;

var motor = new Gpio(18, {mode: Gpio.OUTPUT})


app.listen(3001, ip.address(), () => console.log(`listening on http://${ip.address()}:3001`))


function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}


io.on('connection', function (socket) {

    setInterval(() => socket.emit('servo_pulse_width::get', motor.getServoPulseWidth()), 1000)

    socket.on('servo_pulse_width::set', data => {
        data = parseInt(data);
        if(data >=  500 && data <= 2500) motor.servoWrite(data)
    });
});