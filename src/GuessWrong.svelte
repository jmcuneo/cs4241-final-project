<script>
    import CardInner from "./CardInner.svelte";
    import { createEventDispatcher } from "svelte";

    export let img;
    export let name;

    const dispatch = createEventDispatcher();

    function click() {
        let obj = { continue: true };
        dispatch("flip", obj);
    }
</script>

<div class="guess-confirm">
    <div class="popup continue">
        <span>You Guessed Wrong</span>
        <CardInner {img} {name}></CardInner>
        <button class="confirm-button" on:click={click}>Continue </button>
    </div>
</div>
