import React, {useEffect, useState} from 'react';
import '../css/Memory.css';
import axios from 'axios';

// when interacting with the tile object, these are the props that it accepts
interface tileProps {
    value: string;
    onClick: () => void;
    isFlipped: boolean;
    isDone: boolean;
}

// represents an individual tile component
// if tile is flipped, shows value and vice-versa
// accepts props for value and an onClick handler
function Tile({ value, onClick, isFlipped, isDone }: tileProps) {
    let statusClass = 'bg-green-500 cursor-pointer';
    if (isDone) {
        statusClass = 'bg-blue-200 cursor-default';
    }
    else if (isFlipped) {
        statusClass = 'bg-green-200 cursor-default';
    }

    let content = '';
    if (isDone) {
        content = '✓';
    }
    else if (isFlipped) {
        content = value;
    }
    else {
        content = '😊';
    }

    return (
        <div className={`flex-grow self-stretch flex justify-center items-center text-4xl font-serif transition duration-200 ${statusClass}`}
             onClick={onClick}
             role="button"
             aria-label={`Tile ${value}`}
        >
            {content}
        </div>
    );
}

export function msToReadable(time: number) {
    let minutes = "";
    if (time >= 60000)
        minutes = (("0" + Math.floor((time / 60000) % 60)).slice(-2) + ":");

    const seconds = ("0" + Math.floor((time / 1000) % 60)).slice((time >= 10000) ? -2 : -1) + ".";
    const ms = ("0" + Math.floor((time / 10) % 100)).slice(-2);
    return minutes + seconds + ms;
}
// function for the game itself
function Memory() {
    function createTiles(rows: number, cols: number) {
        const values = Array.from({ length: rows * cols / 2 }, (_, index) => index);
        const shuffledValues = [...values, ...values].sort(() => Math.random() - 0.5);
        return shuffledValues.map((value) => String(value));
    }

    const [difficulty, setDifficulty] = useState<string>('easy');
    const [rows, setRows] = useState<number>(3);
    const [cols, setCols] = useState<number>(4);
    const [tiles, setTiles] = useState<string[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);

    const [time, setTime] = useState<number>(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [intervalID, setIntervalID] = useState<NodeJS.Timer>();

    // states: idle, play, won
    const [state, setState] = useState<string>('idle');
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const getUserData = async () => {
            const response = await fetch("/api/auth/getUserData", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                },
            });
            const data = await response.json();
            console.log(data);
            setUsername(data.login);
        };
        getUserData();
    }, []);

    const handleWon = async () => {
        console.log(time, (new Date()).getTime(), username);
        const data = {
            username: username,
            score: time,
            game: 'memory-' + difficulty,
        }
        console.log(data);
        const response = await axios.post("/api/dbScoreRoutes", data)
    }

    useEffect(() => {
        if (state !== 'play') return;

        clearInterval(intervalID);
        setIntervalID(
            setInterval(() => {
                setTime((new Date()).getTime() - startTime)
            }, 10)
        );
    }, [startTime])

    useEffect(() => {
        if (state === 'play') {
            setTiles(createTiles(rows, cols));
            setFlipped([]);
            setMatched([]);

            setStartTime((new Date()).getTime());
        }
        else if (state === 'won') {
            clearInterval(intervalID);
            alert("You won! Time: " + msToReadable(time));
            setState('idle');

            handleWon();
        }
    }, [state])

    // function that handles the tile flipping and matching logic
    const handleTileClick = (tileID: number) => {
        if (state !== 'play') return;

        // don't flip if:
        // if two tiles are already flipped
        // or the clicked tile is already flipped
        // or the clicked tile is already matched
        if (flipped.length >= 2 || flipped.includes(tileID) || matched.includes(tileID)) {
            return;
        }

        if (flipped.length === 1) {
            // if two tiles have just been flipped

            if (tiles[flipped[0]] === tiles[tileID]) {
                // if the two tiles match

                // check if all tiles have been matched
                if (matched.length + 2 === tiles.length) {
                    setState('won');
                }

                // add them to the doneTiles array
                setMatched([...matched, flipped[0], tileID]);
            }

            // set a timer to hide them
            setTimeout(() => {
                setFlipped([]);
            }, 1000);
        }

        // flip the tile that was clicked
        setFlipped([...flipped, tileID]);
    };

    function handleDifficulty(e: React.ChangeEvent<HTMLSelectElement>) {
        setDifficulty(e.target.value);
        switch (e.target.value) {
            case 'easy':
                setRows(3);
                setCols(4);
                break;
            case 'medium':
                setRows(4);
                setCols(5);
                break;
            case 'hard':
                setRows(5);
                setCols(8);
                break;
        }
    }



    let grid_cols = '';
    if (cols === 4) grid_cols = 'grid-cols-4';
    else if (cols === 5) grid_cols = 'grid-cols-5';
    else if (cols === 8) grid_cols = 'grid-cols-8';

    return (
        <main className="h-screen flex flex-col justify-center items-center align-items-center text-center">
            {state === 'play' ? (
                <div role="region" aria-label="Memory game" className="bg-gradient-to-r from-black to-green-500 w-2/3 h-5/6 gap-4 p-8 bg-green-300 rounded-3xl">
                    <p className="font-bold text-white text-5xl mb-4">{msToReadable(time)}</p>
                    <div
                        className={`gap-4 max-w-screen-sm h-5/6 mx-auto grid ${grid_cols} opacity-25'}`}>
                        {tiles.map((value, index) => (
                            <Tile
                                key={index}
                                value={value}
                                isFlipped={flipped.includes(index)}
                                isDone={matched.includes(index)}
                                onClick={() => handleTileClick(index)}
                            />
                        ))}
                    </div>
                </div>
                ) : (
                <div role="region" aria-label="Memory game setup" className="flex justify-center items-center bg-gradient-to-r from-black to-green-500 w-1/3 gap-4 p-8 bg-green-300 rounded-3xl">
                    <div className={`flex justify-center`}>
                        <>
                            <select
                                className="font-mono font-bold bg-green-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                onChange={handleDifficulty}
                                defaultValue="easy"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                            <button type="button" onClick={() => setState('play')}
                                    className="flex items-center mx-4 bg-green-900 hover:bg-emerald-300 text-white font-bold py-2 px-4 border-b-4 border-green-600 hover:border-blue-500 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                     className="bi bi-play" viewBox="0 0 16 16">
                                    <path
                                        d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
                                </svg>
                                Play
                            </button>
                        </>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Memory;
