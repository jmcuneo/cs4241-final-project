<script>
    export let name="";
    export let img;
    export let whomst = false;

    function onload(e) {
        e.style.backgroundImage = `url(${img.src})`;
    }
</script>

<div class="card-inner" class:whomst>
    <div use:onload class="card-img" />
    {#if name}
        <span class="card-name">{name}</span>
    {/if}
</div>
