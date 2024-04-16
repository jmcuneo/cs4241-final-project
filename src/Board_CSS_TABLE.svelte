<script>
    import { Circle } from "svelte-loading-spinners";
    import Card from "./Card.svelte";

    const width = 6;
    const height = 4;
    const bingo = "WHOMST";

    function get_name(id) {
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

    async function get_board() {
        await new Promise((r) => setTimeout(r, 1000));
        return [...Array(width * height).keys()].map((e) => ({
            name: get_name(e),
            link: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(e + 1 + "").padStart(3, "0")}.png`,
        }));
    }

    let images = get_board();
    let size = Math.min(
        (document.body.clientWidth * 0.75) / 2,
        document.body.clientHeight / 2,
    );
</script>

{#await images}
    <div class="board-spinner">
        <Circle {size} color="Silver" duration="1s"></Circle>
    </div>
{:then board}
    <div class="grid" style="grid-template-columns: repeat({width}, 1fr);">
        {#each Array(width) as _, j}
            <h1>{bingo[j] || ""}</h1>
        {/each}
    </div>
    <div class="grid" style="grid-template-columns: repeat({width}, 1fr);">
        {#each Array(height) as _, j}
            {#each Array(width) as _, i}
                {@const card = board[i + j * width]}
                <Card link={card.link} name={card.name}></Card>
            {/each}
        {/each}
    </div>
{:catch}
    <h1>Something went wrong</h1>
{/await}
