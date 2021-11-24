// Make connection
const socket = io();
 
var NickNameModal = new bootstrap.Modal(document.getElementById('NickNameModal'));
NickNameModal.show();

var NickName=document.getElementById("NickName");
var NickNameForm=document.getElementById("NickNameForm");

var message=document.getElementById("message");
var typing=document.getElementById("typing");
var chatMessage=document.getElementById("chat-message");
var chatFrom=document.getElementById("chatFrom");
var userContainer=document.getElementById("userContainer");
var ownUser="";

// Emit events
document.getElementById('NickNameModal').addEventListener('shown.bs.modal', function () {
    NickName.focus();
  })
  document.getElementById('NickNameModal').addEventListener('hidden.bs.modal', function () {
    message.focus();
  })
  NickNameForm.addEventListener('submit',(e)=>{
      e.preventDefault();
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
socket.on('userList', function(users){
    if(users.length && ownUser!=""){
        const filterUser=users.filter((user)=>{ if(user.NickName!=ownUser) return user.NickName})     
        const filterUserClean=filterUser.map((user)=>{ return user.NickName})

        if(filterUserClean.length>0){
            userContainer.classList.remove("d-none");
            userContainer.classList.add("d-block");
            userContainer.innerHTML=`<div class="col alert alert-success fw-bold">Online Users(${filterUserClean.length}): ${filterUserClean.join(', ')}</div>`;
        }else{
            userContainer.classList.add("d-none");
            userContainer.classList.remove("d-block");
            userContainer.innerHTML="";
        }
    }else{
        
    }
});
socket.on('output message', function(data){
    if(data.length){
        data.forEach( data => {
            typing.innerHTML = '';
            var userIsOwnMeClass="";
            if(ownUser==data.user){
                userIsOwnMeClass="box-title-grean ms-2";
            }else{
                userIsOwnMeClass="box-title-red offset-2";
            }
            chatMessage.innerHTML += '<div class="row pe-2"><div class="col-10 bg-white p-3 rounded-3 shadow-sm mb-3 '+userIsOwnMeClass+'"><strong>' + data.user + ': </strong>' + data.text + '</div></div>';                        
        });
        chatMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });

    }

});

socket.on('send message', function(data){
    if(ownUser!=""){
        typing.innerHTML = '';
        var userIsOwnMeClass="";
        if(ownUser==data.user){
            userIsOwnMeClass="box-title-grean ms-2";
        }else{
            userIsOwnMeClass="box-title-red offset-2";
        }
        chatMessage.innerHTML += '<div class="row pe-2"><div class="col-10 bg-white p-3 rounded-3 shadow-sm mb-3 '+userIsOwnMeClass+'"><strong>' + data.user + ': </strong>' + data.message + '</div></div>';        
        chatMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
});

socket.on('typing', function(user){    
    if(user != null && ownUser!=""){
        typing.innerHTML = '<p><em>' + user + ' is typing a message...</em></p>';
        typing.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
});