<script>
    import { Route, Router } from 'svelte-routing';
    import { Link } from 'svelte-routing';
    import LoginPage from './Login.svelte';
    import HomePage from './Home.svelte';
    import GamePage from './Game.svelte';
</script>

<Router>
    <Route path="/" component={HomePage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/game" component={GamePage} />

</Router>
