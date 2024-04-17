<script lang="ts">
    // @ts-nocheck
    import { createEventDispatcher } from "svelte";
    import socket from "./socket.js";

    const dispatch = createEventDispatcher();

    function joinGame(game_id: string, player: number) {
        dispatch("gameStart", {
            id: game_id,
            player,
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
        socket.on("host success", (room, num) => {
            errorMsg = room;
            joinGame(room, num);
        });
        socket.on("join success", (room, num) => {
            errorMsg = room;
            joinGame(room, num);
        });
    };
</script>

<div class="board-spinner">
    <label for="hostGame">Host Game:</label>
    <input id="hostGame" on:keydown={hostEnter} />
    <label for="joinGame">Join Game:</label>
    <input id="joinGame" on:keydown={joinEnter} />
    {#if errorMsg != ""}
        <div id="errorMsg">{errorMsg}</div>
    {/if}
</div>
