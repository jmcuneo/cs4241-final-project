import {useEffect, useState} from 'react'
import './App.css'

function App() {
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
              setScore(0)
              setWordCount(0)
              setUsedWord([])
              setSeconds(10)
              setShowInput(true);
              setGameEnd(false);
              setNameSubmit(false);
              setNameYes(false);
              const response = await fetch('https://api.datamuse.com/words?sp=??????&max=1000'); // 获取所有单词
              const data = await response.json();
              const filteredWords = data.filter(startWord => startWord.word.length > 4  && !/\s/.test(startWord.word));
              const randomIndex = Math.floor(Math.random() * filteredWords.length);
              setStartWord(filteredWords[randomIndex].word);
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
    const handleNameInput = (event) => {
        setNameInput(event.target.value)
        handleNameSubmit(event)
    }


      //submit Username
    const handleNameSubmit = (event) =>{
        if (event.key === 'Enter') {  //should add the function to add name and score to db
           setNameYes(false)
           setNameSubmit(true)
           setNameInput('')
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
                    <h1>Congratulation!</h1>
                    <div className="container">
                    <div className="column">
                        <h1>Word Counter</h1>
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
                        placeholder="Your Name"
                    />
                </p>
            )}
            {!showInput && gameEnd && nameSubmit &&(
                <p>Congratulations! You have submitted your name and score successfully</p>
            ) }


          {/* Start Word */}
            {!showInput && !gameEnd &&(<button onClick={fetchStartWord}>Start</button>)}
            {!showInput && gameEnd &&(<button onClick={fetchStartWord}>Start a New Game</button>)}
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
