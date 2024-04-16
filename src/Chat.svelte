<script>
    import { io } from "socket.io-client";
    const socket = io();
    window.onload=function(){
        const input = document.getElementById("input");
        input.onkeydown=(e)=>{
            if(e.key==="Enter"){
                socket.emit('chat message',input.value);
            }
        }
    }
</script>

<input id="input">