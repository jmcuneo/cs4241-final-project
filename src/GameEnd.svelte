<script>
    import CardInner from "./CardInner.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let game_data;
    console.log("Game data:", game_data);
    function leaveGame() {
        dispatch("backToHost", {});
    }
    let game_type = 'pokemon'
    let did_win = game_data.winner == game_data.player;
    let title = did_win ? "You Win!" : "You Lose.";
    let message = did_win ? `You guessed ${game_data.correct.name}` : `Your ${game_type} was ${game_data.correct.name}`;
</script>

<div class="game-end-text">
    <h1>{title}</h1>
    <span>{message}</span>
    <div class="leaveButtonContainer">
        <button class="deny-button" on:click={leaveGame}>OK</button>
    </div>
</div>
<CardInner img={game_data.correct.img} name={game_data.correct.name} whomst
></CardInner>
