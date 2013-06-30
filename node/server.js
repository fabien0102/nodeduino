/**
 * SERVER HTTP 
 **/

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(1337);
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});


/**
 * ARDUINO -> WEBSOCKET
 **/

// Init serialPort module
var SerialPort = require('serialport');

// Last value (GLOBAl)
var lastValue = 0;

// Search serialPort for auto-connect
SerialPort.list(function (err, ports) {
    ports.forEach(function (port) {
        arduinoBegin(port.comName);

    });
});



function arduinoBegin(port) {
    var receivedData = "";
    var sendData = "";

    // Init of serialport
    var serialPort = new SerialPort.SerialPort("COM5", {
        baudrate: 9600,
        // defaults for Arduino serial communication
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    });

    // Listens serial connection
    serialPort.on("open", function () {
        console.log('Open serial communication on '+port);

        // Listens to incoming data
        serialPort.on('data', function (data) {
            receivedData += data.toString();

            if (receivedData.indexOf('E') >= 0 && receivedData.indexOf('B') >= 0) {
                // save the data between 'B' and 'E'
                sendData = receivedData.substring(receivedData.indexOf('B') + 1, receivedData.indexOf('E'));
                // Empty data var
                receivedData = '';
            }

            // send the incoming data to browser with websockets.
            lastValue = sendData;
            io.sockets.emit('update', sendData);
        });
    });
}

/**
 * NEW CLIENT ACTION -> log + send last value
 **/
io.sockets.on('connection', function (socket){
    console.log('New client');
    socket.emit('update', lastValue);
});