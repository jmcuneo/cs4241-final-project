import React, {useState} from 'react';
import './App.css';
import {useMutation, useQuery} from "@tanstack/react-query";
import {addScore, fetchScores, scoreEntry} from "./service/Score.ts";
import {queryClient} from "./service/QueryClient.ts";

export default function App() {
    //list of words
    const [words, setWords] = useState<string[]>([]);
    //start, running, or end
    const [game, setGame] = useState<string>("start");
    //word count
    const [wordCount, setWordCount] = useState(0);
    //score
    const [score, setScore] = useState(0);
    //username
    const [username, setUsername] = useState('');
    //timer
    const [seconds, setSeconds] = useState(10);
    //inputValue
    const [inputValue, setInputValue] = useState('');
    //Message, error or success
    const [msg, setMsg] = useState('');


    /************************************* Timer *************************************/
    const intervalRef = React.useRef();

    const start = () => {
        setSeconds((prev) => {
            if (prev === 0) {
                stop();
                return 0;
            }
            return prev - 1;
        })
    }

    const interval = () => {
        // @ts-ignore
        intervalRef.current = setInterval(() => {
            start();
        }, 1000);
    }

    const stop = () => {
        clearInterval(intervalRef.current);
        setGame("end");
        setMsg("");
    }
    /************************************* Timer *************************************/

    const getGameScores = useQuery<scoreEntry[], Error>({
        queryKey: ["scores"],
        queryFn: () => fetchScores(),
        refetchInterval: false
    });

    const postScore = useMutation({
        mutationKey: ["scores"],
        mutationFn: (body: any) => addScore(body),
        onSuccess: () => {
            setMsg("Congratulations! You have submitted your name and score successfully!");
            setUsername('');
            //firework animation
            const fireworksContainer = document.getElementById('fireworks-container');
            for (let i = 0; i < 20; i++) {
                createFirework();
            }
            function createFirework() {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = `${Math.random() * 100}%`;
                firework.style.animationDuration = `${Math.random() * 2 + 1}s`;
                // @ts-ignore
                fireworksContainer.appendChild(firework);

                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }
            return queryClient.invalidateQueries({queryKey: ["scores"]})
        },
        onError: err => {
            setMsg(`Score was not submitted: ${err}`);
        }
    });

    //Is it a word?
    const isWord = async (str: string) => {
        const apiUrl = `https://api.datamuse.com/words?sp=${str}&max=1`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data.length > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    //Is the length long enough?
    const checkString = async (str: string) => {
        const lastWord = words[words.length -1];

        if (lastWord[lastWord.length - 1] !== str[0]) {
            setMsg(`${str} does not start with the last letter of ${lastWord}`);
            return false;
        }
        if (words.includes(str)) {
            setMsg(`You have already used ${str}`)
            return false;
        }
        if (str.length > 4){
            return await isWord(str);
        }
        setMsg("Word is too short! Must be >4 characters!");
        return false;
    }

    //submit word
    const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
         if (event.key === 'Enter') {
             checkString(inputValue).then((result) => {
                 if (result) {
                     setMsg("");
                     setWords(prevState => [...prevState, inputValue])
                     setWordCount(wordCount + 1);
                     setScore(prevScore => {
                         const newScore = prevScore + inputValue.length;
                         setInputValue('');
                         return newScore;
                     })
                     setSeconds(10);
                 } else {
                     if (!(msg.length > 0)) {
                         setMsg(`${inputValue} is not a word!`);
                     }
                 }
             });
         }
     }

    const fetchStartWord = async () => {
        try {
            //Game reset
            setGame("running");
            setScore(0);
            setWordCount(0);
            setSeconds(10);
            setMsg("");
            interval();

            //Initial word
            const response = await fetch('https://api.datamuse.com/words?sp=??????&max=1000');
            const data = await response.json();
            // @ts-ignore
            const filteredWords = data.filter(item => item.word.length > 4  && !/\s/.test(item.word));
            const randomIndex = Math.floor(Math.random() * filteredWords.length);
            const startWord = filteredWords[randomIndex].word;
            setWords([startWord]);
        } catch (error) {
            console.error('Error fetching random word:', error);
        }
    }

    //submit Username & score
    const handleNameSubmit = () => {
        if (username.length > 0) {
            const body = {
                username: username,
                score: score
            }

            postScore.mutate(body);
        } else {
            setMsg("Please enter a username");
        }
    }

    const renderWords = words.map((word) => {
        return (
            <div className={"usedWord"}>{word}</div>
        );
    });

    const arrayData = getGameScores.data === undefined ? null : getGameScores.data.sort((a, b) => b.score - a.score);
    const arrayScoresItems = arrayData === null ? null : arrayData.map((s) =>
        <li><p>{s.score}</p><p>{s.username}</p></li>
    );

    const renderGameState = () => {
        if (game === "start") {
            return (
                <body>
                    <div className={"instruction"}>
                        <p>You have ten seconds to respond</p>
                        <p>Avoid reusing any previously used words</p>
                        <p>Input words must have a length greater than 4</p>
                        <p>Scores are based on the length of words you input</p>
                        <p>Good Luck!</p>
                    </div>
                    <button onClick={fetchStartWord}>Start Game</button>
                    <h2>Leaderboard</h2>
                    <div className={"leaderboard"}>
                        <ul className={"scores"}>{arrayScoresItems}</ul>
                    </div>
                </body>
            );
        } else if (game === "running") {
            return (
                <body>
                <div className={"container"}>
                    <div className={"column"}>
                        <h1>Countdown Timer</h1>
                        <p>{seconds} seconds left</p>
                    </div>
                    <div className="column">
                        <h1>Word Counter</h1>
                        <p>{wordCount}</p>
                    </div>
                    <div className="column">
                        <h1>Score</h1>
                        <p>Score: {score}</p>
                    </div>
                </div>
                <div className={"lastWord"}>
                    <p>{words[words.length-1]}</p>
                </div>
                <p>{msg}</p>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyUpCapture={handleSubmit}
                    placeholder="Press Enter to Submit"
                />
                <div className="array-container">
                    {renderWords}
                </div>
                </body>
            );
        } else if (game === "end") {
            return (
                <body>
                    <div className={"container"}>
                        <div className="column">
                            <h1>Word Counter</h1>
                            <p>{wordCount}</p>
                        </div>
                        <div className="column">
                            <h1>Score</h1>
                            <p>Score: {score}</p>
                        </div>
                    </div>
                    <h2>Leaderboard</h2>
                    <div className={"leaderboard"}>
                        <ul className={"scores"}>{arrayScoresItems}</ul>
                    </div>
                    <button onClick={handleNameSubmit} disabled={(msg === "Congratulations! You have submitted your name and score successfully!")}>
                        Submit Your Name & Score
                    </button>
                    <br/>
                    <br/>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Type Your Name Here"
                    />
                    <p>{msg}</p>
                    <button onClick={fetchStartWord}>Start New Game</button>
                </body>
            );
        }
    }

    return (
        <>
        {renderGameState()}
            <div id="fireworks-container"></div>
        </>
    );
}
