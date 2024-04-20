import './main.scss'
import App from './App.svelte'
// import {io} from "socket.io-client";

// const socket = io();
const app = new App({
    target: document.getElementById('app'),
})

export default app



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
            body: JSON.stringify({ roomCode: 'newGameTest' }),
            headers: {
                "Content-Type": "application/json",
            }
        })
    let res2 = await find_game.json();
    console.log(res2)

    const create_game = await fetch('/create_new_game',
        {
            method: "POST",
            body: JSON.stringify({ roomCode: 'game time', type: "pokemon" }),
            headers: {
                "Content-Type": "application/json",
            }
        })
    let res3 = await create_game.json();
    console.log(res3)

    const get_pokemon_at_index = await fetch('/get_pokemon_from_game',
        {
            method: "POST",
            body: JSON.stringify({ roomCode: 'game time', index: 2 }),
            headers: {
                "Content-Type": "application/json",
            }
        })
    let res4 = await get_pokemon_at_index.json();
    console.log(res4);

}

test();