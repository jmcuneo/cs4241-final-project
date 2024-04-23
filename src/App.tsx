import {useEffect, useState} from 'react'
import './App.css'

function App() {
    //end the game
    const [gameEnd,setGameEnd] = useState(false);
    //whether start the game
    const [showInput, setShowInput] = useState(false);
     //startWord
     const [startWord, setStartWord] = useState('')
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
    const handleInput = (event) => {
        setInputValue(event.target.value)
        handleSubmit(event)
     }
    //submit word
    //feel free to change the code, should add the function to check the word here
     const handleSubmit = (event) => {
         if (event.key === 'Enter') {  //should add the function to check the word here
             wordCountIncrement()
             setUsedWord(prevState => [...prevState, inputValue])
             setScore(prevScore => {
                 const newScore = prevScore + inputValue.length;
                 setInputValue('');
                 return newScore;
             })
             setSeconds(10)
         }
     }

    //timer
      useEffect(() =>{
          const timer = setInterval(() => {
              setSeconds(prevSeconds => prevSeconds - 1)
          }, 1000)
          if(seconds ===0){
              setGameEnd(true)
              setShowInput(false)
              clearInterval(timer)
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
              setSeconds(10)
              setShowInput(true);
              setGameEnd(false);
              const response = await fetch('https://api.datamuse.com/words?sp=??????&max=1000'); // 获取所有单词
              const data = await response.json();
              const filteredWords = data.filter(startWord => startWord.word.length > 4  && !/\s/.test(startWord.word));
              const randomIndex = Math.floor(Math.random() * filteredWords.length);
              setStartWord(filteredWords[randomIndex].word);
          } catch (error) {
              console.error('Error fetching random word:', error);
          }
      }

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
                    <h1>Score Counter</h1>
                    <p>Score: {score}</p>
                </div>

            </div>)}
            {!showInput && gameEnd &&(
                <div>
                    <p>Congratulation! Your word counter is {wordCount}, score is {score}!</p>
                </div>
            )}

          {/* Start Word */}
            {!showInput && !gameEnd &&(<button onClick={fetchStartWord}>Start</button>)}
            {!showInput && gameEnd &&(<button onClick={fetchStartWord}>Restart</button>)}
            {showInput && startWord && !gameEnd && <p>Start Word: {startWord}</p>}
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
    </>
  )
}

export default App
