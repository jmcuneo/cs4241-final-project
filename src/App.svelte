<script lang="ts">
    // @ts-nocheck
    import HostJoin from "./HostJoin.svelte";
    import Board from "./Board.svelte";
    import Chat from "./Chat.svelte";
    let game_data: { id: string; player: Number } = null;

    function gameStart(new_game_data) {
        game_data = new_game_data.detail;
    }

    function gameEnd() {
        game_data = null;
    }
</script>

{#if game_data == null}
    <div id="host-join">
        <HostJoin on:gameStart={gameStart}></HostJoin>
    </div>
{:else}
    <div class="board">
        <Board {game_data} on:gameEnd={gameEnd}></Board>
    </div>
    <div class="chat">
        <Chat {game_data}></Chat>
    </div>
{/if}
