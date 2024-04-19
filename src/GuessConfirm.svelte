<script>
    export let src;
    export let name;
</script>

<div class="guess-confirm">
    <div class="confirm">
        <div class="confirm-text">
            Are you sure you want to guess {name}?
        </div>
        <div class="card-inner">
            <div class="card-img" style="background-image: url('{src}');" />
        </div>
        <button class="confirm-button">yes</button>
        <button class="deny-button">no</button>
    </div>
</div>
