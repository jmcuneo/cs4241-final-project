import './main.scss'
import App from './App.svelte'
// import {io} from "socket.io-client";

// const socket = io();
const app = new App({
    target: document.getElementById('app'),
})

export default app


const json = { pokedex: 800 }

async function test() {
    const response = await fetch('/get_pokemon_by_unique_id', {
        method: "POST",
        body: JSON.stringify({ id: 800 }),
        headers: {
            "Content-Type": "application/json",
        }
    })
    let res = await response.json();
    console.log(res)



    const find_game = await fetch('/get_game_by_room_code',
        {
            method: "POST",
            body: JSON.stringify({ roomcode: 'game time' }),
            headers: {
                "Content-Type": "application/json",
            }
        })
    let res2 = await find_game.json();
    console.log(res2)

}

test();