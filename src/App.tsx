import {useEffect, useState} from 'react'
import './App.css'
import {addScore, fetchScores, scoreEntry} from "./service/Score.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import {queryClient} from "./service/QueryClient.ts";

function App() {
    //startWord
    const [startWord, setStartWord] = useState('');
    //username
    const [username, setUsername] = useState('');
    const [usernameExists, setUsernameExists] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    //display last word
    const [lastWord, setLastWord] = useState('');
    //whether timer running
    const [timerRunning, setTimerRunning] = useState(false);
    //input name
    const [nameInput, setNameInput] = useState('');
    //whether need to submit name
    const [nameYes, setNameYes] = useState(false)
    //whether submit name
    const [nameSubmit, setNameSubmit] = useState(false);
    //end the game
    const [gameEnd,setGameEnd] = useState(false);
    //whether start the game
    const [showInput, setShowInput] = useState(false);
    //word count
     const [wordCount, setWordCount] = useState(0);
    //score
     const [score, setScore] = useState(0);
    //timer
     const [seconds, setSeconds] = useState(10);
    //inputValue
     const[inputValue, setInputValue] = useState('');
     //word used
    const [usedWord, setUsedWord] = useState<string[]>([]);


    //get word
    // @ts-ignore
    const handleInput = (event) => {
        setInputValue(event.target.value)
        handleSubmit(event)
     }
    //submit word
    //feel free to change the code, should add the function to check the word here
     // @ts-ignore
    const handleSubmit = (event) => {
         if (event.key === 'Enter') {  //should add the function to check the word here
             wordCountIncrement()
             setUsedWord(prevState => [...prevState, inputValue])
             setScore(prevScore => {
                 setLastWord(inputValue);
                 const newScore = prevScore + inputValue.length;
                 setInputValue('');
                 return newScore;
             })
             setSeconds(10)
         }
     }

    //timer
      useEffect(() => {
              const timer = setInterval(() => {
                  setSeconds(prevSeconds => prevSeconds - 1)
              }, 1000)
              if (seconds === 0 && timerRunning) {
                  setGameEnd(true)
                  setShowInput(false)
                  clearInterval(timer)
                  setTimerRunning(false)
              }
              return () => clearInterval(timer);
          }, [seconds]);


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
    //fetch startWord
      const fetchStartWord = async () => {
          try {
              setTimerRunning(true)
              setScore(0)
              setWordCount(0)
              setUsedWord([])
              setSeconds(10)
              setShowInput(true);
              setGameEnd(false);
              setNameSubmit(false);
              setNameYes(false);
              const response = await fetch('https://api.datamuse.com/words?sp=??????&max=1000');
              const data = await response.json();
              // @ts-ignore
              const filteredWords = data.filter(item => item.word.length > 4  && !/\s/.test(item.word));
              const randomIndex = Math.floor(Math.random() * filteredWords.length);
              setLastWord(filteredWords[randomIndex].word)
          } catch (error) {
              console.error('Error fetching random word:', error);
          }
      }

      const displayName = () =>{
        if(nameYes){
        setNameYes(false)}
        else{
            setNameYes(true)
        }
      }



      //input Username
    // @ts-ignore
    const handleNameInput = (event) => {
        setNameInput(event.target.value)
        handleNameSubmit(event)
    }


      //submit Username
    // @ts-ignore
    const handleNameSubmit = (event) =>{
        if (event.key === 'Enter') {  //should add the function to add name and score to db
           setNameYes(false)
           setNameSubmit(true)
           setNameInput('')
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
        }
    }

  // @ts-ignore
    // @ts-ignore
    return (
    <>
        <div>
            {/*Counters*/}
            {showInput && !gameEnd && (  <div className="container">
                <div className="column">
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

            </div>)}
            {!showInput && gameEnd &&(
                <div>
                    <h1>Game Over!</h1>
                    <div className="container">
                    <div className="column">
                        <h1>Word Count</h1>
                        <p>{wordCount}</p>
                    </div>
                    <div className="column">
                        <h1>Score</h1>
                        <p>Score: {score}</p>
                    </div>
                    </div>
                </div>
            )}
            {!showInput && gameEnd && !nameSubmit &&(
                <p>
                <button onClick={displayName}>Submit Your Name & Score</button></p>
            )}
            {!showInput && gameEnd && nameYes && !nameSubmit &&(
                <p className="InputName">
                    <input
                        type="text"
                        value={nameInput}
                        onChange={handleNameInput}
                        onKeyUpCapture={handleNameSubmit}
                        placeholder="Press Enter to Submit Your Name"
                    />
                </p>
            )}
            {!showInput && gameEnd && nameSubmit &&(
                <p>Congratulations! You have submitted your name and score successfully</p>
            ) }



          {/* Start Word */}
            {!showInput && !gameEnd &&(
                <>
                    <div className="instruction">
                        <p>You have ten seconds to respond</p>
                        <p>Avoid reusing any previously used words</p>
                        <p>Input words must have a length greater than 4</p>
                        <p>Scores are based on the length of words you input</p>
                        <p>Good Luck!</p>
                    </div>
                <button onClick={fetchStartWord}>Start Game</button>
                </>)}
            {!showInput && gameEnd &&(<button onClick={fetchStartWord}>Start a New Game</button>)}
            {showInput && lastWord && !gameEnd &&
                <b><p>{lastWord}</p></b>}
            <div className="InputWord">
                {showInput && !gameEnd &&( <input
                    type="text"
                    value={inputValue}
                    onChange={handleInput}
                    onKeyUpCapture={handleSubmit}
                    placeholder="Press Enter to Submit"
                />
                )}
            <div className="array-container">
                {showInput && !gameEnd && (
                        usedWord.map((number, index) => (
                    <div className="usedWord" key={index}>{number}</div>
                        )
                    ))}
            </div>
            </div>
      </div>
        <div id="fireworks-container"></div>
    </>
  );
}
