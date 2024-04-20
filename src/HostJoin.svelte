<script lang="ts">
    // @ts-nocheck
    import { createEventDispatcher } from "svelte";
    import socket from "./socket.js";

    const dispatch = createEventDispatcher();

    function joinGame(game_id: string, player: string) {
        dispatch("gameStart", {
            room:game_id,
            player:player
        });
    }

    function hostEnter(e) {
        if (e.key === "Enter") {
            socket.emit("host game", e.target.value);
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
        socket.on("host failed", (msg) => {
            errorMsg = msg;
        });
        socket.on("join failed", (msg) => {
            errorMsg = msg;
        });
        socket.on("host success", (room, name) => {
            errorMsg = room;
            // socket.emit("chat message",room,num,"Player " + num + " joined.");
            joinGame(room, name);
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
