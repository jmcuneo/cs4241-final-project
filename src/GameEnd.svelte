<script>
    import CardInner from "./CardInner.svelte";
    export let game_data;

</script>

<div class="endMsg">
    {#if game_data.winner == game_data.player}
        <h1>You Win!</h1>
    {:else}
        <h1>You lose!</h1>
    {/if}
    Correct card: <CardInner
        whomst=false
        name={game_data.correct_name}
        src={game_data.correct_url}
        card_hover=false
    ></CardInner>
</div>
