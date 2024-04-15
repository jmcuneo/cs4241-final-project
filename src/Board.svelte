<script>
    import { Circle } from "svelte-loading-spinners";
    //import card from "./Card.svelte";

    const width = 6;
    const height = 4;

    async function get_board() {
        await new Promise((r) => setTimeout(r, 3000));
        return [...Array(width*height).keys()].map((e) => ({
            id: e,
            link: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(e + 1 + "").padStart(3, "0")}.png`,
        }));
    }

    let images = get_board();
</script>

{#await images}
    <Circle size="200" color="#ff0000" unit="px" duration="1s"></Circle>
{:then board}
    <Circle size="100" color="#0000FF" unit="px" duration="1s"></Circle>
{:catch}
    <h1>Something went wrong</h1>
{/await}
