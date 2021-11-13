// Make connection
const socket = io();
 
var NickNameModal = new bootstrap.Modal(document.getElementById('NickNameModal'));
NickNameModal.show();

var NickName=document.getElementById("NickName");
var NickNameButton=document.getElementById("NickNameButton");

var message=document.getElementById("message");
var typing=document.getElementById("typing");
var chatMessage=document.getElementById("chat-message");
var chatFrom=document.getElementById("chatFrom");
var ownUser="";

// Emit events
NickNameButton.addEventListener('click',()=>{
    if(NickName.value.length == 0){
        document.getElementById("NickName-error").innerText="Please Enter Your NickName";
    }else{
        socket.emit('new user', NickName.value);
        ownUser=NickName.value;
        NickNameModal.hide();
    }
})

chatFrom.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(message.value.length != 0){
        socket.emit('new message', message.value);
        message.value="";
    }
})

message.addEventListener('keypress', function(){    
    socket.emit('typing');
})

// Listen for events
socket.on('send message', function(data){
    typing.innerHTML = '';
    if(ownUser==data.user){
        chatMessage.innerHTML += '<p>1111<strong>' + data.user + ': </strong>' + data.message + '</p>';
    }else{
        chatMessage.innerHTML += '<p>2222<strong>' + data.user + ': </strong>' + data.message + '</p>';
    }
    
    chatMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
});

socket.on('typing', function(user){    
    typing.innerHTML = '<p><em>' + user + ' is typing a message...</em></p>';
    typing.scrollIntoView({ behavior: 'smooth', block: 'end' });
});