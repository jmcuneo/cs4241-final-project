import {useEffect, useState} from 'react'
import './App.css'

function App() {
    //startWord
    const [startWord, setStartWord] = useState('')
    //word count
    const [wordCount, setWordCount] = useState(0);
    //score
    const [score, setScore] = useState(0);
    //timer
    const [seconds, setSeconds] = useState(10);
    //username
    const [username, setUsername] = useState('');
    const [usernameExists, setUsernameExists] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);


    useEffect(() =>{
        const timer = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds - 1)
        }, 1000)
        if(seconds ===0){
            clearInterval(timer)
        }
        return () => clearInterval(timer);
    }, [seconds]);


    //word count increment
    const wordCountIncrement = () =>{
        setWordCount(wordCount + 1);
    }
    //
    const fetchStartWord = async () => {
        try {
            const response = await fetch('https://api.datamuse.com/words?sp=??????&max=1000'); // 获取所有单词
            const data = await response.json();
            // @ts-ignore
            const filteredWords = data.filter(startWord => startWord.word.length > 4  && !/\s/.test(startWord.word));
            const randomIndex = Math.floor(Math.random() * filteredWords.length);
            setStartWord(filteredWords[randomIndex].word);
        } catch (error) {
            console.error('Error fetching random word:', error);
        }
    }

    //MongoDB code from A3
    // const checkUsernameExists = async () => {
    //     try {
    //         const response = await fetch(``); //MongoDB route
    //         const data = await response.json();
    //         setUsernameExists(data.exists);
    //     } catch (error) {
    //         console.error('Error: ', error);
    //     }
    // };


    const usernames = ["Nick", "Lucas", "Trevor", "Jay", "Yuran"]

    //Helper function returning boolean
    const checkUsernameExists = async (username: string) => {
        if (username === "") {
            return true;
        }
        return usernames.includes(username);
    };



    return (
        <>
            <div>
                {/*//Enter username button and check if it exists*/}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {/*<button onClick={checkUsernameExists}>Check Username</button>*/}
                {/*{usernameExists ? <p>Username exists</p> : <p>Username available</p>}*/}
                <button onClick={async () => { //Check username button
                    try {
                        const exists = await checkUsernameExists(username);
                        setUsernameExists(exists);
                    } catch (error) {
                        console.error('Error: ', error);
                    }
                }}>
                    Check Username
                </button>
                {/*label for userNameExists state*/}
                {usernameExists ? <p>Username exists</p> : <p>Username available</p>}
                {/* basic word count/time/score */}
                <div className="container">
                    <div className="column">
                        <h1>Countdown Timer</h1>
                        <p>{seconds} seconds left</p>
                    </div>
                    <div className="column">
                        <h1>Word Counter</h1>
                        <p>{wordCount}</p>
                    </div>
                    <div className="column">
                        <h1>Score Counter</h1>
                        <p>Score: {score}</p>
                    </div>

                </div>

                {/* Start Word */}
                <button onClick={fetchStartWord}>Start</button>
                {startWord && <p>Start Word: {startWord}</p>}
            </div>
        </>
    )
}

export default App
