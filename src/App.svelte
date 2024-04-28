<script lang="ts">
    // @ts-nocheck
    import HostJoin from "./HostJoin.svelte";
    import ChooseGame from "./ChooseGame.svelte";
    import Board from "./Board.svelte";
    import Chat from "./Chat.svelte";
    import GameEnd from "./GameEnd.svelte";
    import socket from "./socket.js";
    let game_data: {
        state: string;
        id: string;
        player: string;
        winner: string;
        correct_name: string;
        correct_url: string;
    } = {
        state: "Host or Join",
        id: null,
        player: null,
        winner: null,
        correct_name: null,
        correct_url: null,
    };
    let promise = new Promise((req, res) => {});

    function gameStart(e) {
        const obj = e.detail;
        if (obj.hosting) {
            game_data.state = "Choose Game";
        } else {
            game_data.state = "In Game";
        }
        game_data.id = obj.room;
        game_data.player = obj.player;
    }

    function gameChosen(e) {
        game_data.state = "In Game";
        socket.emit("host game", game_data.id, e.detail.type);
    }

    function gameEnd(e) {
        let obj = e.detail;
        game_data.state = "Game Over";
        game_data.correct = obj.board[obj.answer];
        game_data.winner = obj.winner;
    }

    function backToHost(e) {
        //TODO: Write this on server.
        socket.emit("complete game left", game_data.id, game_data.player);
        game_data.state = "Host or Join";
        game_data.id = null;
        game_data.player = null;
        game_data.winner = null;
        game_data.correct_name = null;
        game_data.correct_url = null;
        promise = new Promise((req, res) => {});
        game_setup.board = null;
        console.log("Back at host", game_data);
    }

    let game_setup = {};
    socket.on("game setup", (gameBoard, whomst, flipped, guessed, chat) => {
        let new_game_setup = { whomst, flipped, guessed, chat };
        new_game_setup.board = gameBoard.map((e) => ({
            name: e.label,
            link: e.image_url,
        }));
        game_setup = new_game_setup;
    });
</script>

<svelte:head>
    <title>Approximate Whomst - {game_data.state}</title>
</svelte:head>

{#if game_data.state == "Host or Join"}
    <HostJoin on:gameStart={gameStart}></HostJoin>
{:else if game_data.state == "Choose Game"}
    <ChooseGame on:gameChosen={gameChosen}></ChooseGame>
{:else}
    {#if game_data.state == "In Game"}
        <div class="board">
            <Board {game_data} {game_setup} {promise} on:gameEnd={gameEnd}
            ></Board>
        </div>
    {:else if game_data.state == "Game Over"}
        <div class="gameOver">
            <GameEnd
                {game_data}
                on:backToHost={backToHost}
                on:gameStart={gameStart}
            ></GameEnd>
        </div>
    {/if}
    <div class="chat">
        <Chat {game_data} start_chat={game_setup.chat}></Chat>
    </div>
{/if}
