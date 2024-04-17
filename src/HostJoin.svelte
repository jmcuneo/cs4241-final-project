<script>
    import { io } from "socket.io-client";
    const socket = io();
    var gameRoom = "";
    var playerNum;
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
        function showGameUI(){
            hostJoinUI.hidden=true;
            gameUI.hidden=false;
        }
        socket.on('host failed',(msg)=>{
            errorMsg.innerHTML=msg;
        });
        socket.on('join failed',(msg)=>{
            errorMsg.innerHTML=msg;
        });
        socket.on('host success',(room,num)=>{
            errorMsg.innerHTML=room;
            gameRoom=room;
            playerNum=num;
            showGameUI();
        });
        socket.on('join success',(room,num)=>{
            errorMsg.innerHTML=room;
            gameRoom=room;
            playerNum=num;
            showGameUI();
        });
        initializeChat();
    }
    //I'd like to have this in chat.svelte for better code separation but for now
    //I could only figure out how to have it here.
    //If we do end up keeping this as a single script, it should be in App.svelte rather than here.
    function initializeChat(){
        const input = document.getElementById("input");
        const msgDiv = document.getElementById("messages");
        input.onkeydown = (e) => {
            if (e.key === "Enter") {
                // console.log("Enter pressed");
                socket.emit("chat message", gameRoom, playerNum, input.value);
                input.value="";
            }
        };
        socket.on('message receive',(num,msg)=>{
            //This can probably be done better with svelte. For now i'm doing it like this.
            var msgItem = document.createElement("div");
            msgItem.setAttribute('class','message');
            var msgUser = document.createElement('span');
            msgUser.setAttribute('class','username-'+num);
            msgUser.innerHTML="Player " + num + ": ";
            msgItem.appendChild(msgUser);
            var msgContent = document.createElement("span");
            msgContent.setAttribute('class','message-content');
            msgContent.innerHTML=msg;
            msgItem.appendChild(msgContent);
            msgDiv.appendChild(msgItem);
        });
    }
</script>
<p>Host Game:</p>
<input id="hostGame">
<p>Join Game:</p>
<input id="joinGame">
<div id="errorMsg"></div>