import {useEffect, useState} from 'react'
import './App.css'
import {addScore, fetchScores, scoreEntry} from "./service/Score.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import {queryClient} from "./service/QueryClient.ts";

export default function App() {
  //startWord
  const [startWord, setStartWord] = useState('');
  //word count
  const [wordCount, setWordCount] = useState(0);
  //score
  const [score, setScore] = useState(0);
  //timer
  const [seconds, setSeconds] = useState(10);

  //getScores.data has the data
    const getScores = useQuery<scoreEntry[], Error>({
        queryKey: ["scoreboard"],
        queryFn: () => fetchScores()
    });

    //setScore.mutate(body) creates a new entry
    const setScore = useMutation({
        mutationKey: ["newScore"],
        mutationFn: (body: any) => addScore(body),
        onSuccess: () => {
            return queryClient.invalidateQueries({queryKey: ["scoreboard"]});
        }
    });

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



  return (
    <>
        <div>
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
  );
}
