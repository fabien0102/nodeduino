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
// Init of serialport (COM5)
var SerialPort = require('serialport').SerialPort;
var serialPort = new SerialPort("COM5", {
    baudrate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

var receivedData = "";
var sendData = "";

// Listens serial connection
serialPort.on("open", function () {
    console.log('open serial communication');

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
        io.sockets.emit('update', sendData);
    });
});