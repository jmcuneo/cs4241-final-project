import React, {useEffect, useState} from 'react';
import '../css/Memory.css';

const ws = new WebSocket( 'ws://localhost:5000/api' );
// when interacting with the tile object, these are the props that it accepts
interface tileProps {
    value: string;
    onClick: () => void;
    isFlipped: boolean;
    isDone: number;
}

// represents an individual tile component
// if tile is flipped, shows value and vice-versa
// accepts props for value and an onClick handler
function Tile({ value, onClick, isFlipped, isDone }: tileProps) {
    let statusClass = 'bg-green-500 cursor-pointer';
    if (isDone === 1) {
        statusClass = 'bg-blue-200 cursor-default';
    } else if (isDone === -1) {
        statusClass = 'bg-red-200 cursor-default';
    } else if (isFlipped) {
        statusClass = 'bg-green-200 cursor-default';
    }

    let content: string;
    if (isDone === 1 || isDone === -1) {
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
        >
            {content}
        </div>
    );
}

// function for the game itself
function MultiplayerMemory() {




    function createTiles(rows: number, cols: number) {
        const values = Array.from({ length: rows * cols / 2 }, (_, index) => index);
        const shuffledValues = [...values, ...values].sort(() => Math.random() - 0.5);
        ws.send(shuffledValues.map((value) => String(value)).toString())
        return shuffledValues.map((value) => String(value));
    }

    const [rows, setRows] = useState<number>(3);
    const [cols, setCols] = useState<number>(4);
    const [tiles, setTiles] = useState<string[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);

    const [time, setTime] = useState<number>(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [intervalID, setIntervalID] = useState<NodeJS.Timer>();

    const [turn, setTurnn] = useState<number>(0);
    function setTurn(index:number) {
        console.log("set Turn to " + index);
        setTurnn(index)
    }

    // states: idle, play, won
    const [state, setState] = useState<string>('idle');


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
        if (state === 'won') {
            clearInterval(intervalID);
            let score = 0
            matched.forEach((m) => {score += m;});
            if (score > 0) {
                alert("Congratulations, you won! You now have bragging rights.");
            } else if (score < 0) {
                alert("Unfortunately, you lost. Better luck next time.");
            } else {
                alert("You tied. Lets count this as a win.");
            }
            setState('idle');
            setTurn(0);
        }
    }, [state])

    function StartGame() {
        setTurn(2);
        setState('play');
        setTiles(createTiles(rows, cols));
        setFlipped([]);
        setMatched(Array<number>(cols*rows).fill(0));
        setStartTime((new Date()).getTime());
    }

    // function that handles the tile flipping and matching logic
    const handleTileFlip= (tileID: number, index: number) => {
        console.log(state)
        if (state !== 'play') return;

        // don't flip if:
        // if two tiles are already flipped
        // or the clicked tile is already flipped
        // or the clicked tile is already matched
        if (flipped.length >= 2 || flipped.includes(tileID) || matched[tileID] !== 0) {
            return;
        }
        if (flipped.length === 1) {
            // if two tiles have just been flipped

            if (tiles[flipped[0]] === tiles[tileID]) {

                if (index === 1) {
                    ws.send("reset");
                }
                // if the two tiles match
                let temp = matched;
                temp[flipped[0]] = index;
                temp[tileID] = index;

                // check if all tiles have been matched
                let finished = true;
                temp.forEach((m) => {if (m === 0) {finished = false}})
                if (finished) {
                    setState('won');
                }

                // add them to the doneTiles array

                setMatched(temp);
                setTurn(0);
                console.log("reset turn");
            } else {
                setTurn(turn+1);
            }

            // set a timer to hide them
            setTimeout(() => {
                setFlipped([]);
            }, 1000);
        } else {
            setTurn(turn+1);
        }

        // flip the tile that was clicked
        setFlipped([...flipped, tileID]);
    };

    function handleDifficulty(e: React.ChangeEvent<HTMLSelectElement>) {
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

    function msToReadable(time: number) {
        let minutes = "";
        if (time >= 60000)
            minutes = (("0" + Math.floor((time / 60000) % 60)).slice(-2) + ":");

        const seconds = ("0" + Math.floor((time / 1000) % 60)).slice((time >= 10000) ? -2 : -1) + ".";
        const ms = ("0" + Math.floor((time / 10) % 100)).slice(-2);
        return minutes + seconds + ms;
    }

    let grid_cols = '';
    if (cols === 4) grid_cols = 'grid-cols-4';
    else if (cols === 5) grid_cols = 'grid-cols-5';
    else if (cols === 8) grid_cols = 'grid-cols-8';

    function handleTileClick(index: number) {
        console.log(turn)
        if (turn < 2) {
            ws.send(index + "");
            handleTileFlip(index, 1);
        }
    }

    ws.onopen = () => {
        ws.send( 'a new client has connected.' )
        console.log("Connected")
        ws.onmessage = async msg => {
            // add message to end of msgs array,
            // re-assign to trigger UI update
            const message = await msg.data.text();
            if (message.includes(",")) {
                const cards = message.split(",");
                setState('play');
                if (cards.length === 12) {
                    setRows(3);
                    setCols(4);
                    setMatched(Array<number>(12).fill(0));
                } else if (cards.length === 20) {
                    setRows(4);
                    setCols(5);
                    setMatched(Array<number>(20).fill(0));
                } else {
                    setRows(5);
                    setCols(8);
                    setMatched(Array<number>(40).fill(0));
                }
                setTiles(cards);
                setFlipped([]);
                setStartTime((new Date()).getTime());
            }

        }
    }

    useEffect(() => {
        if (state === 'idle') {
            ws.onmessage = async msg => {
                // add message to end of msgs array,
                // re-assign to trigger UI update
                const message = await msg.data.text();
                if (message.includes(",")) {
                    const cards = message.split(",");
                    setState('play');
                    if (cards.length === 12) {
                        setRows(3);
                        setCols(4);
                        setMatched(Array<number>(12).fill(0));
                    } else if (cards.length === 20) {
                        setRows(4);
                        setCols(5);
                        setMatched(Array<number>(20).fill(0));
                    } else {
                        setRows(5);
                        setCols(8);
                        setMatched(Array<number>(40).fill(0));
                    }
                    setTiles(cards);
                    setFlipped([]);
                    setStartTime((new Date()).getTime());
                }

            }
        } else {
            ws.onmessage = async msg => {
                // add message to end of msgs array,
                // re-assign to trigger UI update
                const message = await msg.data.text();
                console.log(message);
                if (message === "reset") {
                    setTurn(2);
                }
                if (!isNaN(parseInt(message))) {
                    handleTileFlip(parseInt(message), -1);
                    if (turn === 2) {
                        setTurn(3);
                    } else {
                        setTurn(0);
                    }
                }
            }
        }
    }, [state, flipped, matched, turn]);

    return (
        <div className="h-screen flex flex-col justify-center items-center align-items-center text-center">
            {state === 'play' ? (
                <div className="bg-gradient-to-r from-black to-green-500 w-2/3 h-5/6 gap-4 p-8 bg-green-300 rounded-3xl">
                    <p className="font-bold text-white text-5xl mb-4">{msToReadable(time)}</p>
                    <div
                        className={`gap-4 max-w-screen-sm h-5/6 mx-auto grid ${grid_cols} opacity-25'}`}>
                        {tiles.map((value, index) => (
                            <Tile
                                key={index}
                                value={value}
                                isFlipped={flipped.includes(index)}
                                isDone={matched[index]}
                                onClick={() => handleTileClick(index)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center bg-gradient-to-r from-black to-green-500 w-1/3 gap-4 p-8 bg-green-300 rounded-3xl">
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

                            <button type="button" onClick={StartGame}
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
        </div>
    );
}

export default MultiplayerMemory;
