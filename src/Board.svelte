<script lang="ts">
    // @ts-nocheck
    import { Circle } from "svelte-loading-spinners";
    import Card from "./Card.svelte";

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

    async function get_board() {
        const board = await get_server_board();
        const proms = board.board.map(
            (e) =>
                new Promise((res, rej) => {
                    e.img = new Image();
                    e.img.onload = res
                    e.img.onerror = rej;
                    e.img.src = e.link;
                }),
        );
        await Promise.all(proms);
        return board;
    }

    let images = get_board();
    let display_board = true;
    
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
        <h1><h1>{bingo[j] || ""}</h1></h1>
    {/each}
</div>

{#await images}
    <div class="board-spinner">
        <Circle {size} color="Silver" duration="1s"></Circle>
    </div>
{:then board}
    <div
        class="grid grid-grow"
        class:hidden={!display_board}
        style="grid-template-columns: repeat({width}, 1fr);"
    >
        {#each Array(height) as _, j}
            {#each Array(width) as _, i}
                {@const index = i + j * width}
                {@const card = board.board[index]}
                <Card
                    src={card.link}
                    name={card.name}
                    whomst={index == board.whomst}
                    game_data={game_data}
                    on:load
                ></Card>
            {/each}
        {/each}
    </div>
{:catch}
    <h1>Something went wrong</h1>
{/await}
