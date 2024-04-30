import React, {MouseEventHandler, useEffect, useState} from 'react';
import sort from "../sort";
import axios from "axios";
import {score} from "common/src/types";
import DifficultySelectButton from "../components/DifficultySelectButton";
import {msToReadable} from "./Memory";


function LeaderBoard() {
    const [scores, setScores] = useState<score[]>([]);
    const [method, setMethod] = useState("reverseRank");
    const [difficulty, setDifficulty] = useState("memory-easy");
    const [activeButton, setActiveButton] = useState(0);
    const [scoresDB, setScoresDB] = useState<score[]>([]);
    const [userScores, setUserScores] = useState<score[]>([]);
    const [username, setUsername] = useState<string>('');

    function formatString(s: string): string {
        let f = "";
        f = f + s.substring(0, 10) + " " + s.substring(11, 19);
        return f;
    }

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

    useEffect(() => {
        axios.get("/api/dbScoreRoutes").then((res) => {
            setScoresDB(res.data);
        });
    }, []);
    
    useEffect(() => {
        let newScores: score[] = [];
        scoresDB.forEach((data: score) => {
            // console.log(data.game);
            if (data.game === difficulty) {
                newScores.push(data);
            }
        });
        
        if (method === 'rank') {
            newScores = sort((a:score, b:score): boolean => {return a.score < b.score;}, newScores);
        } else if (method === 'reverseRank') {
            newScores = sort((a:score, b:score): boolean => {return a.score > b.score;}, newScores);
        } else if (method === 'date') {
            newScores = sort((a:score, b:score): boolean => {return a.createdAt < b.createdAt;}, newScores);
        } else if (method === 'reverseDate') {
            newScores = sort((a:score, b:score): boolean => {return a.createdAt > b.createdAt;}, newScores);
        } else if (method === 'username') {
            newScores = sort((a:score, b:score): boolean => {return a.username < b.username;}, newScores);
        } else if (method === 'reverseUsername') {
            newScores = sort((a:score, b:score): boolean => {return a.username > b.username;}, newScores);
        }

        setScores(newScores);
    }, [method, difficulty, scoresDB]);

    function updateSortDate() {
        if (method === "date") {
            setMethod("reverseDate");
        } else {
            setMethod("date");
        }
    }
    function updateSortUsername() {
        if (method === "username") {
            setMethod("reverseUsername");
        } else {
            setMethod("username");
        }
    }

    function updateSortRank() {
        if (method === "rank") {
            setMethod("reverseRank");
        } else {
            setMethod("rank");
        }
    }

    function displayUserSpecific(){
        let newScores: score[] = [];
        scoresDB.forEach((data: score) => {
            // console.log(data.game);
            if (data.username === username) {
                newScores.push(data);
            }
        });
        setScores(newScores);
    }

    const getSortIndicator = (column: string): JSX.Element | null => {
        if (method === `reverse${column.charAt(0).toUpperCase() + column.slice(1)}`) {
            return <span>&darr;</span>;
        } else if (method === column) {
            return <span>&uarr;</span>;
        }
        return null;
    };

    return (
        <div className={"p-5 flex flex-col justify-center items-center align-items-center text-center rounded-full"}>
            <div className={"max-h-[50vh]"}>
            <h1 className={"font-bold text-6xl mb-16 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)]\n"}>Leaderboard</h1>
                <div className={"flex mb-10 gap-4 justify-center items-center align-items-center"}>
                    <DifficultySelectButton selected={activeButton} buttonNumber={0} setSelected={setActiveButton}
                                            setDifficulty={() => {
                                                setDifficulty("memory-easy")
                                            }} difficulty={"Memory - Easy"}/>
                    <DifficultySelectButton selected={activeButton} buttonNumber={1} setSelected={setActiveButton}
                                            setDifficulty={() => {
                                                setDifficulty("memory-medium")
                                            }} difficulty={"Memory - Medium"}/>
                    <DifficultySelectButton selected={activeButton} buttonNumber={2} setSelected={setActiveButton}
                                            setDifficulty={() => {
                                                setDifficulty("memory-hard")
                                            }} difficulty={"Memory - Hard"}/>
                </div>
                <div className={"max-h-full overflow-y-scroll"}>
                    <table>
                        <thead>
                        <tr>
                            <td className={"font-bold w-12 bg-green-700 text-center border-2 border-black text-3xl"}>#</td>
                            <td onClick={updateSortDate}
                                className={"font-bold w-64 bg-green-700 text-center border-2 border-black text-3xl"}>Date {getSortIndicator('date')}</td>
                            <td onClick={updateSortUsername} className={"font-bold w-44 bg-green-700 text-center border-2 border-black text-3xl"}>Username {getSortIndicator('username')}</td>
                            <td onClick={updateSortRank} className={"font-bold w-40 bg-green-700 text-center border-2 border-black text-3xl"}>Time {getSortIndicator('rank')}</td>
                        </tr>
                    </thead>
                    <tbody className="overflow-y-scrolls h-min">
                        {scores.map((score: score, index: number) => (
                            <tr>
                                <td className={"w-12 bg-emerald-200 text-center border-2 border-black"}>{index+1}</td>
                                <td className={"w-64 bg-emerald-200 text-center border-2 border-black"}>{formatString(score.createdAt.toString())}</td>
                                <td className={"w-32 bg-emerald-200 text-center border-2 border-black"}>{score.username}</td>
                                <td className={"w-32 bg-emerald-200 text-center border-2 border-black"}>{msToReadable(score.score)}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LeaderBoard;
