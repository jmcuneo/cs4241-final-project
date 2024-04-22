<!-- NavigationLinks.svelte -->
<script>
    import { Link } from 'svelte-routing';
</script>

<button> Test </button>

<nav>
    <Link to="/login" >Sign In</Link>
    <Link to="/home">New Game</Link>
    <Link to="/game">Join Game</Link>
</nav>
