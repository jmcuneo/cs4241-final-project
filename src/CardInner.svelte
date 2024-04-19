<script>
    export let name;
    export let img;
    export let whomst = false;
    
</script>

<div class="card-inner" class:whomst>
    <div use:onload class="card-img">
        <img class="card-img" src="{img.src}" alt="{name}">
    </div>
    <span class="card-name">{name}</span>
</div>
