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
</script>

<div class="board">
    {#await images}
        <Circle size="200" color="#ff0000" unit="px" duration="1s"></Circle>
    {:then board}
        <table>
            <tr>
                {#each Array(width) as _, j}
                    <th><h1>{bingo[j] || ""}</h1></th>
                {/each}
            </tr>
            {#each Array(height) as _, j}
                <tr>
                    {#each Array(width) as _, i}
                        {@const card = board[i + j * width]}
                        <td>
                            <Card link={card.link} name={card.name}></Card>
                        </td>
                    {/each}
                </tr>
            {/each}
        </table>
    {:catch}
        <h1>Something went wrong</h1>
    {/await}
</div>
