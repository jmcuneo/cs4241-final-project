<script>
    import ChatMessage from "./ChatMessage.svelte";
    import socket from "./socket.js";

    export let game_data;

    function keydown(e) {
        if (e.key === "Enter") {
            // console.log("Enter pressed");
            console.log(game_data);
            socket.emit(
                "chat message",
                game_data.id,
                game_data.player,
                e.target.value,
            );
            e.target.value = "";
        }
    }
    let messages = [];

    socket.on("message receive", (name, msg) => {
        messages.push({ name: name, message: msg });
        messages=messages;
        console.log(name, msg);
    });
</script>

<div class="chat-window">
    {#each messages as { name, message }}
        <ChatMessage {name} {message}></ChatMessage>
    {/each}
</div>
<p class="code">Code: {game_data.id}</p>
<input on:keydown={keydown} />
