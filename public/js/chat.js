// Make connection
const socket = io();
 
var NickNameModal = new bootstrap.Modal(document.getElementById('NickNameModal'));
NickNameModal.show();

var NickName=document.getElementById("NickName");
var NickNameButton=document.getElementById("NickNameButton");

NickNameButton.addEventListener('click',()=>{
    if(NickName.value.length == 0){
        document.getElementById("NickName-error").innerText="Please Enter Your NickName";
    }else{
        NickNameModal.hide();
    }
})