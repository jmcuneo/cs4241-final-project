<script>
    import CardInner from "./CardInner.svelte";
    export let game_data;
    console.log("Game data:",game_data);

</script>

<div class="endMsg">
    {#if game_data.winner == game_data.player}
        <h1>You Win!</h1>
    {:else}
        <h1>You Lose.</h1>
    {/if}
    <CardInner img = {{src:game_data.correct_url}} name = {game_data.correct_name}></CardInner>
</div>
