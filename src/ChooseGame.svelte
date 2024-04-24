<script>
    import { createEventDispatcher } from "svelte";
    //import socket from "./socket.js";
    const dispatch = createEventDispatcher();

    const GAMES = ["Pokemon", "Minecraft"];
    function setGame(index) {
        dispatch("gameChosen", { index, name: GAMES[index] });
    }
    const LOGOS = ["poke_logo.png", "mine_logo.png"];
    function getLogo(index) {
        return `background-image:url(${LOGOS[index]});`;
    }
</script>

<div class="choose-game">
    <h1 class="text-center">Choose Your Game</h1>
    <div class="choose-grid">
        <button
            class="choose-game-button"
            style={getLogo(0)}
            on:click={() => setGame(0)}
        ></button>
        <button
            class="choose-game-button"
            style={getLogo(1)}
            on:click={() => setGame(1)}
        ></button>
    </div>
</div>
