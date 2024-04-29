const socket = io('http://localhost:3000');

let numPlayers;

let players;

// Listen for 'newMessage' event from the server
socket.on('newMessage', (message) => {
    console.log('Received message from server:', message);
    numPlayers = message.numberOfPlayer
});

// Listen for 'disconnect' event from the server
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('maxPlayersReached', (message) => {
    console.log("maxPlayersReached")
    console.log(message)
    players = message
    generateButtons()
})

socket.on('update', (message) => {
    players = message
    updatePlayerStatus()
})

socket.on('gamestarted', (message) => {
    players = message
    generateButtons()
})

socket.on('gameOver', (message) => {
    console.log(message)
    endGameResults(message)
})

// Function to send a message to the server
function join() {
    let username = document.getElementById("username").value;
    const newMessage = {
        user: username,
        createdAt: Date.now()
    };
    document.getElementById('sendMessageBtn').display = 'none';
    const playerContainer = document.querySelector(".player-container");
    playerContainer.innerHTML = "";
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");
    playerDiv.innerHTML = `
            Waiting for other players to join
        `;
    playerContainer.appendChild(playerDiv);
    // Emit 'createMessage' event to the server with the new message
    socket.emit('join', newMessage);
}

const getUser = async function () {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day

    const response = await fetch("/userdata");
    const data = await response.json();
    console.log(data[0].name);
    const user = data[0].name;
}

function generateButtons() {
    let playerContainer = document.querySelector(".player-container");
    playerContainer.innerHTML = ""; // Clear previous players
    playerContainer =  document.querySelector(".active-game");
    console.log(players)

    players.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("parent");
        playerDiv.innerHTML = `
        <div class="child">
            <button class="playerButton" id="${player.username}">${player.username}: ${player.health}</button>
        </div>
        <div class="child">
            <button class="playerButton" onclick="changeHealth('${player.username}', 1)">+</button>
        </div>
        <div class="child">    
            <button class="playerButton" onclick="changeHealth('${player.username}', -1)">-</button>
        </div>
        <div class="child">
            <button class="playerButton" onclick="death('${player.username}')">Die</button>
        </div>    
        `;
        playerContainer.appendChild(playerDiv);
    })

    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");
    playerDiv.innerHTML = `
            <button class="endButton" onclick="gameOver()">GG</button>
        `;
    playerContainer.appendChild(playerDiv);

    updatePlayerStatus(); // Initial update
}

function changeHealth(playerId, value) {
    const newMessage = {
        user: playerId,
        healthChange: value,
        createdAt: Date.now()
    };
    // Emit 'createMessage' event to the server with the new message
    socket.emit('healthchange', newMessage);
}

function death(playerId) {
    const newMessage = {
        user: playerId,
        createdAt: Date.now()
    };
    document.getElementById(playerId).style.backgroundColor = 'grey'
    // Emit 'createMessage' event to the server with the new message
    socket.emit('playerdeath', newMessage);
}

function gameOver(){
    socket.emit('gameOver', "GG");
}

function updatePlayerStatus() {
    const playerButtons = document.querySelectorAll(".playerButton");
    playerButtons.forEach(button => {
        const playerId = button.id;
        const player = players.find(player => player.username === playerId);

        if (player) {
            const playerButton = button.parentNode.querySelector("button");
            playerButton.textContent = `${player.username}: ${player.health}`; // Assuming health is a property of the player object
        }
    });

}

function endGameResults(playerList) {
    const activeGame = document.querySelector(".active-game");
    activeGame.innerHTML = ""; // Clear previous player list

    const playerListContainer = document.querySelector(".player-container");
    playerListContainer.innerHTML = ""; // Clear previous player list

    playerList.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("player");
        playerDiv.textContent = `${index + 1}. ${player} `; // Assuming health is a property of the player object
        playerListContainer.appendChild(playerDiv);
    });

    // Add button for creating a new game
    const newGameButton = document.createElement("button");
    newGameButton.textContent = "New Game";
    newGameButton.addEventListener("click", createNewGame);
    playerListContainer.appendChild(newGameButton);
}

function createNewGame() {
    window.location.href = '/createGame.html';
}


window.onload = function () {
    // Attach click event listener to the button
    document.getElementById("username").value = document.cookie
    document.getElementById('sendMessageBtn').addEventListener('click', join);
}