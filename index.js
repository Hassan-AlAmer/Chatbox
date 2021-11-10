// App setup
const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const PORT = process.env.PORT || 4000

// Server Listen
server.listen(PORT, ()=>{
    console.log('Server is running on port: ' + PORT);
});

// Static files
app.use(express.static('public'));
 
io.on('connection', (socket) => {
    console.log("connect");
});

