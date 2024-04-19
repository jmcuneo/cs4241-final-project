<script>
    export let whomst;
    export let name;
    export let src;
    export let card_hover;
</script>
<div class="card-inner" class:whomst>
    <div class="card-img" style="background-image: url('{src}');" />
    <span>{name}</span>
    <span>{card_hover}</span>
</div>