const express = require('express');
const ejs = require("ejs");

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    // res.render("index");
});

io.on('connection', (socket) => {
    // console.log('a user connected'); //shows when users connected
    // socket.on('disconnect', () => {
    //     console.log('user disconnected');//shows user disconnected
    //   });
      socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });
  });

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets


http.listen(3000, () => {
  console.log('listening on *:3000');
});