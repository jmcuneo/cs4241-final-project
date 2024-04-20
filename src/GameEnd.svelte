<script>
    import CardInner from "./CardInner.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let game_data;
    console.log("Game data:",game_data);
    function leaveGame(){
        dispatch("backToHost",{});
    }
</script>

<div class="endMsg">
    {#if game_data.winner == game_data.player}
        <h1>You Win!</h1>
    {:else}
        <h1>You Lose.</h1>
    {/if}
    <CardInner img = {{src:game_data.correct_url}} name = {game_data.correct_name}></CardInner>
    <div class="leaveButtonContainer">
        <button class="confirm-button" on:click={leaveGame}>OK</button>
    </div>
</div>
