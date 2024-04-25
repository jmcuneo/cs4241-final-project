<script>
    import CardInner from "./CardInner.svelte";
    import { createEventDispatcher } from "svelte";
    import socket from "./socket.js";
    const dispatch = createEventDispatcher();

    export let game_data;
    //console.log("Game data:", game_data);
    //deleteGameData();
    function leaveGame() {
        dispatch("backToHost", {});
    }

    let game_type = "pokemon";
    let did_win = game_data.winner == game_data.player;
    let title = did_win ? "You Win!" : "You Lose.";
    let message = did_win
        ? `You guessed ${game_data.correct.name}`
        : `Your opponent's ${game_type} was ${game_data.correct.name}`;
    let numEntered = 0;
    let clickedPlayAgain = false;

    function playAgain() {
        if(!clickedPlayAgain){
            //dispatch("backToHost", {});
            socket.emit("play again",game_data.id,game_data.player);
            numEntered++;
            clickedPlayAgain=true;
        }
    }

    // async function deleteGameData() {
    //     const deletedGame = await fetch("/delete_game_by_room_code", {
    //         method: "POST",
    //         body: JSON.stringify({ roomCode: game_data.id }),
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     });
    // }
    socket.on("play again selected",()=>{
        console.log("Play again selected received");
        numEntered++;
    });
    socket.on("play again deselected",()=>{
        console.log("Play again deselected received");
        numEntered--;
    });

    function joinGame(game_id, player) {
        console.log("Joining game");
        dispatch("gameStart", {
            room:game_id,
            player:player,
            hosting:false
        });
    }

    socket.on('host success',joinGame);
    socket.on('join success',joinGame);

</script>

<div class="game-end-side">
    <div class="game-end-text">
        <h1 class="text-center">{title}</h1>
        <span>{message}</span>
    </div>
    <button class="deny-button" on:click={playAgain}>Play Again ({numEntered}/2)</button>
    <button class="deny-button" on:click={leaveGame}>Leave</button>
</div>
<CardInner img={game_data.correct.img} name={game_data.correct.name} whomst
></CardInner>
