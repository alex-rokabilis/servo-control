var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var ip = require("ip");



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

    setInterval(() => socket.emit('servo_pulse_width::get', 1500), 1000)

    socket.on('servo_pulse_width::set', data => console.log(data));
});