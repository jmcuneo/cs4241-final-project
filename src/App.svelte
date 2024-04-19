<script lang="ts">
    // @ts-nocheck
    import HostJoin from "./HostJoin.svelte";
    import Board from "./Board.svelte";
    import Chat from "./Chat.svelte";
    import GameEnd from "./GameEnd.svelte";
    import socket from "./socket.js";
    let game_data: {state: string, id: string; player: string, winner: string, correct_name:string, correct_url:string } = {
        state:"HostJoin",
        id:null,
        player:null,
        winner:null,
        correct_name:null,
        correct_url:null
    };

    function gameStart(e) {
        game_data.state="InGame";
        game_data.id=e.detail.room;
        game_data.player=e.detail.player;
    }

    function gameEnd(e){
        let obj = e.detail;
        game_data.state="GameOver";
        game_data.correct_name=obj.board[obj.answer].name;
        game_data.correct_url=obj.board[obj.answer].link;
        game_data.winner=obj.winner;
    }

</script>

{#if game_data.state == "HostJoin"}
    <div id="host-join">
        <HostJoin on:gameStart={gameStart}></HostJoin>
    </div>
{:else if game_data.state == "InGame"}
    <div class="board">
        <Board {game_data} on:gameEnd={gameEnd}></Board>
    </div>
    <div class="chat">
        <Chat {game_data}></Chat>
    </div>
{:else if game_data.state == "GameOver"}
    <div class="gameOver">
        <GameEnd game_data={game_data}></GameEnd>
    </div>
    <div class="chat">
        <Chat {game_data}></Chat>
    </div>
{/if}
