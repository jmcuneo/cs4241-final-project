<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let img;
    export let name;
    export let whomst;
    export let flipped = false;
    export let perm_flip = false;

    const dispatch = createEventDispatcher();

    let card_hover = true;

    $: has_flipped_class = flipped && !perm_flip;

    function clicked(obj) {
        dispatch("flip", obj);
    }

    function click(e) {
        if (!perm_flip && e.which == 1) {
            flipped = !flipped;
            card_hover = false;
            clicked({ flip: flipped });
        }
    }
    function dclick(e: Event) {
        e.preventDefault();
        if (!flipped && !perm_flip) {
            flipped = true;
            clicked({ perm_flip: true, callback: perm_callback });
            card_hover = false;

            //socket.emit("guess", game_data.id, game_data.player, index, name);
            // socket.emit("chat message",game_data.id,game_data.player,"Player " + game_data.player + " guessed " + name);
        }
    }
    function perm_callback(is_perm_fliped: boolean) {
        flipped = false;
        perm_flip = is_perm_fliped;
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
