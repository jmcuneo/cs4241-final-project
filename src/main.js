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
}

test();