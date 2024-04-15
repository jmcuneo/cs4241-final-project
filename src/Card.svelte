<script>
    import { createEventDispatcher } from 'svelte';

    export let link;
    export let flipped = false;
    export let perm_flip = false;

    $: has_flipped_class = flipped&&!perm_flip;

    function click(){
        
    }
    function dclick(){

    }    

</script>

<button on:click={click} on:dblclick={dclick} class:card-flipped={has_flipped_class} class:card-perm-flipped={perm_flip} >
    <img src={link}>
</button>
