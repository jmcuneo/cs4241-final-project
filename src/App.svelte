<script>
    import HostJoin from "./HostJoin.svelte";
    import Board from './Board.svelte';
    import Chat from './Chat.svelte';
</script>

<div id="in-game" hidden>
    <div class="board">
        <Board></Board>
    </div>
    <div class="chat">
        <Chat></Chat>
    </div>
</div>

<div id="host-join">
    <HostJoin></HostJoin>
</div>