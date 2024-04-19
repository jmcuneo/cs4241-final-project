import {useEffect, useState} from 'react'
import './App.css'

function App() {
  //startWord
  const [startWord, setStartWord] = useState('')
  const fetchStartWord = async () => {
      try {
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
          {/* Start Word */}
          <button onClick={fetchStartWord}>Generate Word</button>
          {startWord && <p>Start Word: {startWord}</p>}
      </div>
    </>
  )
}

export default App
