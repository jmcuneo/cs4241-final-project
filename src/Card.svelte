<script>
    import CardInner from "./CardInner.svelte";
    import socket from "./socket.js";
    
    export let src;
    export let name;
    export let whomst;
    export let game_data;
    export let index;
    export let flipped = false;
    export let perm_flip = false;

    let card_hover = true;

    $: has_flipped_class = flipped && !perm_flip;

    function click() {
        if (!perm_flip) {
            flipped = !flipped;
            card_hover = false;
        }
    }
    function dclick() {
        if (!flipped) {
            perm_flip = true;
            //TODO: Also emit the event for the server to validate the guess.
            socket.emit("guess",game_data.id,game_data.player,index,name);
            // socket.emit("chat message",game_data.id,game_data.player,"Player " + game_data.player + " guessed " + name);
        }
    }
    function hover() {
        card_hover = true;
        console.log("leave");
    }
</script>

<button
    on:click={click}
    on:dblclick={dclick}
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
