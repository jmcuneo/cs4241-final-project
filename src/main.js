import './main.css'
import App from './App.svelte'
import {io} from "socket.io-client";

const socket = io();
const app = new App({
    target: document.getElementById('app'),
})

export default app
