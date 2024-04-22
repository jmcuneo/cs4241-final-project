<script>
    export let player_id;
    export let name;
    export let message;

    const className = ["player1", "player2", "server"];
    let real_name = player_id == 2 ? "Server" : name;
    let message_class = className[player_id];
</script>

<div id="chat-message">
    <span class={message_class}
        >{real_name}:
        <span class="message">{message}</span></span
    >
</div>
