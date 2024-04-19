<script lang="ts">
    import CardInner from "./CardInner.svelte";
    import { createEventDispatcher } from "svelte";

    export let img;
    export let name;
    export let whomst;
    export let game_data;
    export let index;
    export let flipped = false;
    export let perm_flip = false;

    const dispatch = createEventDispatcher();

    let card_hover = true;

    $: has_flipped_class = flipped && !perm_flip;

    function clicked(obj) {
        dispatch("flip", obj);
    }

    function click() {
        if (!perm_flip) {
            flipped = !flipped;
            card_hover = false;
            clicked({ flipped });
        }
    }
    function dclick(e: Event) {
        e.preventDefault();
        if (!flipped && !perm_flip) {
            perm_flip = true;
            clicked({ perm_flip });
            card_hover = false;

            //socket.emit("guess", game_data.id, game_data.player, index, name);
            // socket.emit("chat message",game_data.id,game_data.player,"Player " + game_data.player + " guessed " + name);
        }
    }
    function hover() {
        card_hover = true;
    }
    function onload(e) {
        e.style.backgroundImage = `url(${img.src})`;
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
        <div use:onload class="card-img" />
        <span class="pokemon">{name}</span>
        <!-- <span>{card_hover}</span> -->
    </div>
</button>
