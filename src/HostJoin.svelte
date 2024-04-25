<script lang="ts">
    // @ts-nocheck
    import { createEventDispatcher } from "svelte";
    import socket from "./socket.js";

    const dispatch = createEventDispatcher();
    let room = null;

    function joinGame(game_id: string, player: string) {
        console.log("Joining game");
        dispatch("gameStart", {
            room: game_id,
            player: player,
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
        socket.on("room available", () => {
            errorMsg = room;
            // await create_game(room);
            joinGame(room, "Player 1");
            // socket.emit("chat message",room,num,"Player " + num + " joined.");
        });
        socket.on("join success", (room, name) => {
            errorMsg = room;
            // socket.emit("chat message",room,name,"Player " + name + " joined.");
            joinGame(room, name);
        });
    };
</script>

<div class="board-spinner">
    <h3><label for="hostGame">Host Game:</label></h3>
    <input id="hostGame" on:keydown={hostEnter} />
    <h3><label for="joinGame">Join Game:</label></h3>
    <input id="joinGame" on:keydown={joinEnter} />
    {#if errorMsg != ""}
        <div id="errorMsg">{errorMsg}</div>
    {/if}
</div>
