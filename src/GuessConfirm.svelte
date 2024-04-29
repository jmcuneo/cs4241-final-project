<script>
    import CardInner from "./CardInner.svelte";
    import { createEventDispatcher } from "svelte";

    export let img;
    export let name;
    export let is_continue = false;

    const dispatch = createEventDispatcher();

    function decision(guess_type) {
        let obj = {};
        if (guess_type == 1) {
            obj.confirm = true;
        } else if (guess_type == 2) {
            obj.continue = true;
        } else {
            obj.deny = true;
        }
        dispatch("flip", obj);
    }
</script>

<div class="guess-confirm">
    {#if !is_continue}
        <div class="popup confirm">
            <div class="confirm-text">
                Are you sure you want to guess {name}?
            </div>
            <CardInner {img} {name}></CardInner>
            <button class="confirm-button" on:click={(e) => decision(1)}
                >yes
            </button>
            <button class="deny-button" on:click={(e) => decision(0)}
                >no
            </button>
        </div>
    {:else}
        <div class="popup continue">
            <span>You Guessed Wrong</span>
            <CardInner {img} {name}></CardInner>
            <button
                class="confirm-button quarter-height"
                on:click={(e) => decision(2)}
                >Continue
            </button>
        </div>
    {/if}
</div>
