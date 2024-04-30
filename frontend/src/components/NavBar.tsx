import React from 'react';

function NavBar() {

    return (
        <>
            {
                localStorage.getItem("accessToken") === null ? (
                    <div className={"h-16 flex px-6 items-center w-screen bg-green-700 gap-4"} role="navigation" aria-label="Main navigation" >
                        <a className="font-mono font-bold text-2xl text-white hover:text-emerald-300"
                           href={"/"} title="Go to login page">Login</a>
                        <a className="font-mono font-bold text-2xl text-white hover:text-emerald-300"
                           href={"/instructions"} title="Go to instructions page">Instructions</a>
                    </div>
                ) : (
                    <div className={"h-16 flex px-6 items-center w-screen bg-green-700 gap-4"} role="navigation" aria-label="Main navigation" >
                        <a className="font-mono font-bold text-2xl text-white hover:text-emerald-300"
                           href={"/login"} title="Return to homepage">Homepage</a>
                        <a className=" font-mono font-bold text-2xl text-white hover:text-emerald-300"
                           href={"/leaderboard"} title="Go to leaderboard">Leaderboard</a>
                        <a className="font-mono font-bold text-2xl text-white hover:text-emerald-300"
                           href={"/instructions"} title="Go to instructions page">Instructions</a>
                        <a className="font-mono font-bold text-2xl text-white hover:text-emerald-300"
                           href={"/memory"} title="Go to the singleplayer memory game">Singleplayer</a>
                        <a className="font-mono font-bold text-2xl text-white hover:text-emerald-300"
                           href={"/multiplayer-memory"} title="Go to the muultiplayer memory game">Multiplayer</a>
                    </div>
                )
            }
        </>

    )
}

export default NavBar;
