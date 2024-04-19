<script lang="ts">
    // @ts-nocheck
    import { createEventDispatcher } from "svelte";
    import socket from "./socket.js";

    export let src;
    export let name;
    export let whomst;
    export let game_data;
    export let index;
    export let flipped = false;
    export let perm_flip = false;

    const dispatch = createEventDispatcher();

    let card_hover = true;

    $: has_flipped_class = flipped && !perm_flip;

    function clicked(flip_to: boolean, perm: boolean) {
        dispatch("guess", {
            flip_to,
            perm,
        });
    }

    function click() {
        if (!perm_flip) {
            flipped = !flipped;
            card_hover = false;
            clicked(flipped, false);
        }
    }
    function dclick(e: PointerEvent) {
        e.preventDefault();
        if (!flipped && !perm_flip) {
            perm_flip = true;
    
            clicked(flipped, false);
            clicked(true, true);
            card_hover = false;

            socket.emit("guess",game_data.id,game_data.player,index,name);
            // socket.emit("chat message",game_data.id,game_data.player,"Player " + game_data.player + " guessed " + name);
        }
    }
    function hover() {
        card_hover = true;
    }
</script>

<button
    on:click={click}
    on:contextmenu={dclick}
    on:mouseleave={hover}
    class="card"
    class:card-flipped={has_flipped_class}
    class:card-perm-flipped={perm_flip}
    class:no-card-hover={!card_hover}
>
    <div class="card-inner" class:whomst>
        <div class="card-img" style="background-image: url('{src}');" />
        <span>{name}</span>
        <span>{card_hover}</span>
    </div>
</button>
