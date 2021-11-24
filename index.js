// App setup
const mongoose=require('mongoose');
const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server);
const config=require('./config');
const Message=require('./models/messages');

// Server Listen
server.listen(config.port, ()=>{
    console.log('Server is running on port: ' + config.port);
});

mongoose.Promise=global.Promise;
mongoose.connect(config.mongoURI, {useNewUrlParser:true}).then(()=>{
    console.log("db connected");
}).catch((e)=>{
    console.log(e);
})

// Static files
app.use(express.static('public'));
 let users=[];
io.on('connection', (socket) => {
    console.log("socket connected");
    
    // Handle NickName event
    socket.on('new user', (usr) => {
        socket.NickName = usr;
        users.push({
            id : socket.id,
            NickName : usr
        });

        io.emit('userList', users);

        console.log('NickName connected - NickName: ' + socket.NickName);
        Message.find({},{_id:0}).then((result)=>{
            io.to(socket.id).emit('output message', result);
        })
    });

    // Handle message event
    socket.on('new message', (msg) => {
        const message=new Message();
        message.text=msg;
        message.user=socket.NickName;
        message.save().then(()=>{
            io.emit('send message', {message: msg, user: socket.NickName});
        })
        
    });

    // Handle typing event
    socket.on('typing', ()=>{
        socket.broadcast.emit('typing', socket.NickName);
    });

    socket.on('disconnect',()=>{               
        for(let i=0; i < users.length; i++){           
            if(users[i].id === socket.id){
                users.splice(i,1); 
            }
        }
        io.emit('userList', users);
    });
    socket.on('Get Chat',()=>{               
        Message.find({},{_id:0}).then((result)=>{
            io.to(socket.id).emit('Download Chat', result);
        })
    });
});

