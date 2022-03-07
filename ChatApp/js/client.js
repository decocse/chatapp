
const socket =io('http://localhost:8000');

const form =document.getElementById('send-container');
const messageInput =document.getElementById('messageInp');
const messageContainer =document.querySelector('.container');
const file=document.getElementById('messfile');
const button=document.getElementById('imgbuttn');
button.addEventListener('click',(e)=>{
    console.log('clicked');
    const reader = new FileReader();
    var base64;
    reader.onload = function () {
        base64 = reader.result;
        socket.emit('img',base64);
        var img = document.createElement("img");
        img.src = base64;
        const messageElement=document.createElement('div');
        messageElement.appendChild(img);
        messageElement.classList.add('message');
        messageContainer.append(messageElement);
    };
    reader.readAsDataURL(file.files[0]);
});

socket.on('img',(base64)=>{
    console.log(base64);
    var img = document.createElement("img");
    img.src = base64;
    const messageElement=document.createElement('div');
    messageElement.appendChild(img);
    messageElement.classList.add('message')
    //messageElement.classList.add(position)
    messageContainer.append(messageElement);
    
});



const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement);

}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You:${message}`);
    socket.emit('send',message);
    messageInput.value='';

})

const name=prompt('Enter your name to join');
socket.emit('new-user-joined',name);

socket.on('user-joined',name=>{
    append(`${name} joined the chat`, 'right');
})

socket.on('recieve',data=>{
    append(`${data.name}:${data.message}`, 'left');
})

socket.on('left',name=>{
    append(`${name} left the chat`,'left');
})