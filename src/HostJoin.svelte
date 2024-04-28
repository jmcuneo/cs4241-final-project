<script lang="ts">
    // @ts-nocheck
    import { createEventDispatcher } from "svelte";
    import socket from "./socket.js";

    const dispatch = createEventDispatcher();
    let room = null;

    function joinGame(game_id: string, player: string, hosting: bool = false) {
        console.log("Joining game");
        dispatch("gameStart", {
            room: game_id,
            player: player,
            hosting,
        });
    }

    function hostEnter(e) {
        if (e.key === "Enter") {
            room = e.target.value;
            socket.emit("try host game", room);
            e.target.value = "";
        }
    }
    function joinEnter(e) {
        if (e.key === "Enter") {
            socket.emit("join game", e.target.value);
            e.target.value = "";
        }
    }
    let errorMsg = "";
    window.onload = function () {
        socket.on("room unavailable", () => {
            errorMsg = `Room ${room} is unavailable`;
        });
        socket.on("join failed", (msg) => {
            errorMsg = msg;
        });
        socket.on("room available", (room) => {
            errorMsg = room;
            // await create_game(room);
            joinGame(room, "Player 1", true);
            // socket.emit("chat message",room,num,"Player " + num + " joined.");
        });
        socket.on("join success", (room, name) => {
            errorMsg = room;
            // socket.emit("chat message",room,name,"Player " + name + " joined.");
            joinGame(room, name, false);
        });
    };
</script>

<div class="board-spinner">
    <p class="instructions">
        Welcome to Approximate Whomst! Enter a room code and press enter on the "Host Game" field 
        to host a game. Select what game type you would like to play, then give your friend the room
        code!
    </p>
    <p class="instructions">
        To join a game, enter the room code your friend gave you in the "Join Game"
        field and press enter. In the game, take turns asking yes or no questions.
        Your card is the one highlighted in yellow. Use left click to flip over a card you <i>don't</i> 
        think is your opponent's, and use right click to guesss a card you <i>do</i> think is your 
        opponent's. Whoever guesses their opponent's card first wins.
    </p>
    <h3><label for="hostGame">Host Game:</label></h3>
    <input id="hostGame" on:keydown={hostEnter} />
    <h3><label for="joinGame">Join Game:</label></h3>
    <input id="joinGame" on:keydown={joinEnter} />
    {#if errorMsg != ""}
        <div id="errorMsg">{errorMsg}</div>
    {/if}
</div>
