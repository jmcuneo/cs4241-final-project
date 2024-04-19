<script lang="ts">
    // @ts-nocheck
    import { Circle } from "svelte-loading-spinners";
    import Card from "./Card.svelte";
    import GuessConfirm from "./GuessConfirm.svelte";

    import socket from "./socket.js";

    export let game_data;

    const width = 6;
    const height = 4;
    const bingo = "WHOMST";

    function get_name(id: number) {
        const names = [
            "bulb",
            "char",
            "squirt",
            "cat",
            "bee",
            "bird",
            "rat",
            "pigeon",
            "snake",
        ];
        return id > 18
            ? names[((id - 18) >> 1) + 6] + " " + (((id - 18) % 2) + 1)
            : names[Math.floor(id / 3)] + " " + ((id % 3) + 1);
    }

    async function get_server_board() {
        await new Promise((r) => setTimeout(r, 1000));
        return {
            board: [...Array(width * height).keys()].map((e) => ({
                name: get_name(e),
                link: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(e + 1 + "").padStart(3, "0")}.png`,
            })),
            whomst: 4,
        };
    }

    // prefetch all images before rendering board
    async function get_board() {
        const board = await get_server_board();
        const proms = board.board.map(
            (e) =>
                new Promise((res, rej) => {
                    e.img = new Image();
                    e.img.onload = res;
                    e.img.onerror = rej;
                    e.img.src = e.link;
                }),
        );
        await Promise.all(proms);
        return board;
    }

    let images = get_board();
    let display_board = true;

    let guess_data = null;
    async function flip(e, index: Number) {
        const board = await images;
        const obj = e.detail;
        if (obj.confirm) {
            guess_data.callback(true);
            socket.emit("guess", game_data.id, game_data.player, index);
            guess_data = null;
        } else if (obj.deny) {
            guess_data.callback(false);
            guess_data = null;
        } else if (obj.perm_flip) {
            guess_data = { id: index, callback: obj.callback };
        } else {
            // send flip with obj.flip
            // socket.emit(
            //     "flip",
            //     game_data.id,
            //     game_data.player,
            //     index,
            //     board.board[index].name,
            // );
            // socket.emit("flipped", game_data.id, game_data.player, index);
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
</script>

<div class="grid" style="grid-template-columns: repeat({width}, 1fr);">
    {#each Array(width) as _, j}
        {@const letter = bingo[j] || ""}
        <img class="letter" alt="Pokemon {letter}" src="Poke_{letter}.png" />
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
            src={card.link}
            name={card.name}
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
            <!-- {#each Array(width) as _, i}
                {@const index = i + j * width} -->
            {@const card = board.board[j]}
            <Card
                img={card.img}
                name={card.name}
                whomst={j == board.whomst}
                on:load
                on:flip={(e) => flip(e, j)}
            ></Card>
        {/each}
        <!-- {/each} -->
    </div>
{:catch}
    <h1>Something went wrong</h1>
{/await}
