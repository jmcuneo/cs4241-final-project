<script lang="ts">
    import CardInner from "./CardInner.svelte";
    import socket from "./socket.js";
    import { createEventDispatcher } from "svelte";
    
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
        dispatch("flip", {
            flip_to,
            perm,
            index
        });
    }

    function click(e) {
        if (!perm_flip && e.which==1) {
            flipped = !flipped;
            card_hover = false;
            clicked(flipped, false);
        }
    }
    function dclick(e: Event) {
        e.preventDefault();
        if (!flipped && !perm_flip) {
            perm_flip = true;
            clicked(true, true);
            card_hover = false;

            // socket.emit("guess",game_data.id,game_data.player,index,name);
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
    <CardInner 
        whomst={whomst}
        name={name}
        src={src}
        card_hover={card_hover}
    ></CardInner>
</button>
