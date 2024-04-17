import './main.scss'
import App from './App.svelte'
// import {io} from "socket.io-client";

// const socket = io();
const app = new App({
    target: document.getElementById('app'),
})

export default app


const json = {pokedex: 800}

const response = await fetch('/get_pokemon_by_unique_id', {
    method: "POST",
    body: JSON.parse("800")
})

console.log(JSON.stringify( await response.json()))