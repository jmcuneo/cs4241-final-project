let user = "Kombucha";

const socket = io('http://localhost:3000');

// Listen for 'newMessage' event from the server
socket.on('newMessage', (message) => {
    console.log('Received message from server:', message);
});

// Function to send a message to the server
function join() {
    const newMessage = {
        user: user,
        createdAt: Date.now()
    };
    // Emit 'createMessage' event to the server with the new message
    socket.emit('join', newMessage);
}

// Listen for 'disconnect' event from the server
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});


const getUser = async function(  ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    
    const response = await fetch("/userdata");
    const data = await response.json();
    console.log(data[0].name);
    const user = data[0].name;
  }

function generatePlayers() {
    const numPlayers = document.getElementById("numPlayers").value;
    const playerContainer = document.querySelector(".player-container");
    playerContainer.innerHTML = ""; // Clear previous players

    for (let i = 1; i <= numPlayers; i++) {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("player");
        playerDiv.innerHTML = `
            <button id="player${i}"></button>
            <button onclick="increaseHealth(${i})">+</button>
            <button onclick="decreaseHealth(${i})">-</button>
        `;
        playerContainer.appendChild(playerDiv);
    }

    updatePlayerStatus(); // Initial update
}

function increaseHealth(playerId) {
    const playerButton = document.getElementById(`player${playerId}`);
    const currentHealth = parseInt(playerButton.dataset.health || 0);
    const newHealth = currentHealth + 1;
    playerButton.dataset.health = newHealth;
    updatePlayerStatus();
}

function decreaseHealth(playerId) {
    const playerButton = document.getElementById(`player${playerId}`);
    const currentHealth = parseInt(playerButton.dataset.health || 0);
    const newHealth = currentHealth - 1 >= 0 ? currentHealth - 1 : 0;
    playerButton.dataset.health = newHealth;
    updatePlayerStatus();
}

function updatePlayerStatus() {
    // This function should be replaced with server communication logic
    const players = document.querySelectorAll(".player button[id^='player']");
    players.forEach(playerButton => {
        const playerId = playerButton.id.replace("player", "");
        const playerName = `Player ${playerId}`;
        const health = parseInt(playerButton.dataset.health || 0);
        playerButton.textContent = `${playerName}: ${health} HP`;
    });
}

window.onload = function () {
    // Attach click event listener to the button
    document.getElementById('sendMessageBtn').addEventListener('click', join);
}