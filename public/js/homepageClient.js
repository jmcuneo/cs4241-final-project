
window.onload = function () {
    const allMessages = fetch("/messages", {
        method: "GET",
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            for (let msg of data) {
                const username = msg.username
                const datetime = msg.datetime
                const content = msg.content
                const messageDisplay = document.getElementById('messageDisplay');
                const formattedMessage = `${username} - ${content} - ${datetime}`;
                //maybe use a different element type instead of div for better format 
                const messageElement = document.createElement('div');
                messageElement.textContent = formattedMessage;
                messageDisplay.appendChild(messageElement);
            }
        })
}


let currUser
//websocket comm stuff 
document.addEventListener('DOMContentLoaded', async function () {
    const user = await fetch("/user", {
        method: "GET",
    })
        .then(function (response) {
            return response.json();
        });
        console.log(user);

    const ws = new WebSocket('ws://localhost:3000/messages?user=' + encodeURIComponent(user.username));

    ws.onopen = function () {
        console.log('WebSocket Client Connected');
    };

    //replace with fetch?? 
    ws.onmessage = function (event) {
        const message = JSON.parse(event.data);
        const messageDisplay = document.getElementById('messageDisplay');
        const formattedMessage = `${message.username} - ${message.content} - ${message.datetime}`;
        const messageElement = document.createElement('div');
        messageElement.textContent = formattedMessage;
        messageDisplay.appendChild(messageElement);
    };


    document.getElementById('sendButton').addEventListener('click', function () {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value;
        ws.send(message);
        messageInput.value = '';
    });
});