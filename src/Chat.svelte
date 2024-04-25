<script>
    import ChatMessage from "./ChatMessage.svelte";
    import socket from "./socket.js";

    export let game_data;

    let chatWindow;
    let messages = [];

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

    socket.on("message receive", (name, msg) => {
        let player_num = 0;
        if (name == "Server") {
            player_num = 2;
        } else if (name == "Player 1") {
            player_num = 0;
        } else {
            player_num = 1;
        }

        messages.push({ name: name, message: msg, player_num });
        messages = messages;
        console.log(name, msg);
        setTimeout(scroll);
    });

    function scroll(height) {
        chatWindow.scroll(0, chatWindow.scrollHeight);
    }
    //let oldHeight;
    //let actualHeight;
    // function scroll() {}
    // $: actualHeight, scroll();
</script>

<div class="chat-window" bind:this={chatWindow}>
    {#each messages as { name, message, player_num }}
        <ChatMessage {name} {message} player_id={player_num}></ChatMessage>
    {/each}
</div>
<p class="code">Code: {game_data.id}</p>
<label for="msginput">Type a Message:</label>
<input id="msginput" on:keydown={keydown}/>
