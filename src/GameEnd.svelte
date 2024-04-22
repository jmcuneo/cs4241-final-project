<script>
    import CardInner from "./CardInner.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let game_data;
    console.log("Game data:", game_data);
    deleteGameData();
    function leaveGame() {
        dispatch("backToHost", {});
    }
    function playAgain() {
        //dispatch("backToHost", {});
    }
    let game_type = "pokemon";
    let did_win = game_data.winner == game_data.player;
    let title = did_win ? "You Win!" : "You Lose.";
    let message = did_win
        ? `You guessed ${game_data.correct.name}`
        : `Your opponent's ${game_type} was ${game_data.correct.name}`;

    async function deleteGameData() {
        const deletedGame = await fetch("/delete_game_by_room_code", {
            method: "POST",
            body: JSON.stringify({ roomCode: game_data.id }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
</script>

<div class="game-end-side">
    <div class="game-end-text">
        <h1 class="text-center">{title}</h1>
        <span>{message}</span>
    </div>
    <button class="deny-button" on:click={playAgain}>Play Again</button>
    <button class="deny-button" on:click={leaveGame}>Leave</button>
</div>
<CardInner img={game_data.correct.img} name={game_data.correct.name} whomst
></CardInner>
