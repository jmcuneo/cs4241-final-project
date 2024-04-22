<script>
    import { Route, Router } from 'svelte-routing';
    import { Link } from 'svelte-routing';
    import LoginPage from './Login.svelte';
    import HomePage from './Home.svelte';
    import GamePage from './Game.svelte';
</script>

<Router>
    <Route path="/login" component={LoginPage} />
    <Route path="/home" component={HomePage} />
    <Route path="/game" component={GamePage} />

<nav>
    <Link to="/login" >Sign In</Link>
    <Link to="/home">New Game</Link>
    <Link to="/game">Join Game</Link>
</nav>

</Router>
