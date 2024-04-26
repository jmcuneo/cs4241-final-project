<script>
    import ChatMessage from "./ChatMessage.svelte";
    import socket from "./socket.js";

    export let game_data;
    export let start_chat;

    let chatWindow;
    let messages = [];
    let messages_loaded = false;

    function set_msgs() {
        if (!messages_loaded && start_chat) {
            messages_loaded = true;
            messages = start_chat.map(msg_map).concat(messages);
            setTimeout(scroll);
        }
    }

    $: start_chat, set_msgs();

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

    function msg_map(e) {
        let player_num = 0;
        if (e.author == "Server") {
            player_num = 2;
        } else if (e.author == "Player 1") {
            player_num = 0;
        } else {
            player_num = 1;
        }

        return { name: e.author, message: e.msg, player_num };
    }

    socket.on("message receive", (author, msg) => {
        messages.push(msg_map({ author, msg }));
        messages = messages;
        console.log(author, msg);
        setTimeout(scroll);
    });

    function scroll() {
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
<input id="msginput" on:keydown={keydown} />
