<script>
    export let src;
    export let name;
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    function decision(is_guess){
        let obj = {};
        if (is_guess){
            obj.confirm=true;
        }else{
            obj.deny=true;
        }
        dispatch('flip',obj);
    }
</script>

<div class="guess-confirm">
    <div class="confirm">
        <div class="confirm-text">
            Are you sure you want to guess {name}?
        </div>
        <div class="card-inner">
            <div class="card-img" style="background-image: url('{src}');" />
        </div>
        <button class="confirm-button" on:click={(e)=>decision(true)}>yes</button>
        <button class="deny-button" on:click={(e)=>decision(false)}>no</button>
    </div>
</div>
