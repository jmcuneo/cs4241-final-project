<script lang="ts">
    // @ts-nocheck
    import { Circle } from "svelte-loading-spinners";
    import Card from "./Card.svelte";
    import GuessConfirm from "./GuessConfirm.svelte";

    import socket from "./socket.js";

    export let game_data;

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    const width = 6;
    const height = 4;
    const bingo = "WHOMST";

    // prefetch all images before rendering board
    async function get_board(serverBoard, flipped, guessed) {
        const board = serverBoard;
        const proms = board.board.map(
            (e, index) =>
                new Promise((res, rej) => {
                    e.img = new Image();
                    e.img.onload = res;
                    e.img.onerror = rej;
                    e.img.src = e.link;
                    e.flipped = flipped[index];
                    e.perm_flip = guessed[index];
                }),
        );
        await Promise.all(proms);
        return board;
}


    let images = new Promise((req, res) => {});
    let display_board = true;

    socket.on("game setup", (gameBoard, whomst, flipped, guessed, chat) => {
        let serverBoard = { board: [], whomst: -1 };
        serverBoard.whomst = whomst;
        serverBoard.board = [];
        for (let i = 0; i < gameBoard.length; i++) {
            serverBoard.board.push({
                name: gameBoard[i].label,
                link: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(gameBoard[i].unique_id + "").padStart(3, "0")}.png`,
            });
        }
        display_board = true;
        images = get_board(serverBoard, flipped, guessed);
    });

    let guess_data = null;
    async function flip(e, index: Number) {
        const board = await images;
        const obj = e.detail;
        if (obj.continue) {
            guess_data = null;
        }
        if (obj.confirm) {
            socket.emit(
                "guess",
                game_data.id,
                game_data.player,
                index,
                board.board[index].name,
            );
        } else if (obj.deny) {
            guess_data.callback(false);
            guess_data = null;
        } else if (obj.perm_flip) {
            guess_data = { id: index, callback: obj.callback, failed: false };
        } else {
            socket.emit(
                "flip",
                game_data.id,
                game_data.player,
                index,
                board.board[index].name,
            );
        }
    }

    // //image load hack
    // images.then(()=>
    // requestAnimationFrame(()=>
    // requestAnimationFrame(()=>
    // requestAnimationFrame(()=>
    // display_board=true))));
    // images.then(()=>setTimeout(() => {
    //     display_board=true;
    // }, 100));
    // requestAnimationFrame(()=>
    // requestAnimationFrame(()=>
    // requestAnimationFrame(()=>
    // display_board=true))));

    let size = Math.min(
        (document.body.clientWidth * 0.75) / 2,
        document.body.clientHeight / 2,
    );

    async function gameEnd(winner, answer) {
        console.log("GAME BEGINS TO END");
        let board = await images;
        console.log("GAME END", winner, answer);
        // console.log(winner,correct_name,correct_url);
        dispatch("gameEnd", {
            board: board.board,
            winner: winner,
            answer: answer,
        });
    }

    async function getNumPokemon() {
        const numPokemon = await fetch("/get_num_pokemon", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let res = await numPokemon.json();
        return res.count;
    }

    async function getPokemonFromGame(room) {
        const get_pokemon_at_index = await fetch("/get_pokemon_from_game", {
            method: "POST",
            body: JSON.stringify({ roomCode: room }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        let pokemon = await get_pokemon_at_index.json();
        return pokemon;
    }
    function guessFailed() {
        guess_data.callback(true);
        guess_data.failed = true;
    }

    socket.on("game end", gameEnd);
    socket.on("guess failed", guessFailed);
</script>

<div
    class="grid"
    style="grid-template-columns: repeat({width}, 1fr);"
    class:stop_events={guess_data != null}
>
    {#each Array(width) as _, j}
        {@const letter = bingo[j] || ""}
        <img class="letter" alt="pokemon {letter}" src="poke_{letter}.png" />
    {/each}
</div>

{#await images}
    <div class="board-spinner">
        <Circle {size} color="Silver" duration="1s"></Circle>
    </div>
{:then board}
    {#if guess_data != null}
        {@const card = board.board[guess_data.id]}
        <GuessConfirm
            img={card.img}
            name={card.name}
            is_continue={guess_data.failed}
            on:flip={(e) => flip(e, guess_data.id)}
        ></GuessConfirm>
    {/if}
    <div
        class="grid grid-grow"
        class:hidden={!display_board}
        class:stop_events={guess_data != null}
        style="grid-template-columns: repeat({width}, 1fr);"
    >
        {#each Array(height * width) as _, j}
            {@const card = board.board[j]}
                <Card
                img={card.img}
                name={card.name}
                whomst={j == board.whomst}
                flipped={card.flipped}
                perm_flip={card.perm_flip}
                on:load
                on:flip={(e) => flip(e, j)}
            ></Card>
        {/each}
    </div>
{:catch error}
    <h1>Something went wrong</h1>
    <p>{error}</p>
{/await}
