<script>
    import { io } from "socket.io-client";
    const socket = io();
    window.onload=function(){
        const hostInput = document.getElementById("hostGame");
        const joinInput = document.getElementById("joinGame");
        hostInput.onkeydown = (e) => {
            if (e.key === "Enter") {
                socket.emit("host game", hostInput.value);
                hostInput.value="";
            }
        };
        joinInput.onkeydown = (e) => {
            if (e.key === "Enter") {
                socket.emit("join game", joinInput.value);
                joinInput.value="";
            }
        };
        const errorMsg = document.getElementById("errorMsg");
        const gameUI = document.getElementById("in-game");
        const hostJoinUI = document.getElementById("host-join");
        socket.on('host failed',(msg)=>{
            errorMsg.innerHTML=msg;
        });
        socket.on('join failed',(msg)=>{
            errorMsg.innerHTML=msg;
        });
        socket.on('host success',(room)=>{
            errorMsg.innerHTML=room;
            hostJoinUI.hidden=true;
            gameUI.hidden=false;
        });
        socket.on('join success',(room)=>{
            errorMsg.innerHTML=room;
        });
    }
</script>
<p>Host Game:</p>
<input id="hostGame">
<p>Join Game:</p>
<input id="joinGame">
<div id="errorMsg"></div>