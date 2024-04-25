import {useEffect, useState} from 'react'
import './App.css'

function App() {
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


  //word count increment
    const wordCountIncrement = () =>{
        setWordCount(wordCount + 1);
    }
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
                <p>
                    <input
                        type="text"
                        value={nameInput}
                        onChange={handleNameInput}
                        onKeyUpCapture={handleNameSubmit}
                        placeholder="Your Name Here"
                    />
                </p>
            )}
            {!showInput && gameEnd && nameSubmit &&(
                <p>Congratulations! You have submitted your name and score successfully</p>
            ) }


          {/* Start Word */}
            {!showInput && !gameEnd &&(<button onClick={fetchStartWord}>Start Game</button>)}
            {!showInput && gameEnd &&(<button onClick={fetchStartWord}>Start a New Game</button>)}
            {showInput && lastWord && !gameEnd && <p>{lastWord}</p>}
            <div>
                {showInput && !gameEnd &&( <input
                    type="text"
                    value={inputValue}
                    onChange={handleInput}
                    onKeyUpCapture={handleSubmit}
                    placeholder="Press Enter to Submit"
                />
                )}
            <div>
                {showInput && !gameEnd && usedWord.map((number, index) => (
                    <p key={index}>{number}</p>
                ))}
            </div>
            </div>
      </div>
        <div id="fireworks-container"></div>
    </>
  )
}

export default App
