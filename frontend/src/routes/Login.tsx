import React, {useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import leaderboard from "./Leaderboard";

const CLIENT_ID = "f0bb48553c39a2d19844";

function Login() {
    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({
        login: null
    })
    let githubUser = {}
    useEffect( () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParams = urlParams.get("code");
        const getUserData = async () => {
            const response = await fetch("api/auth/getUserData", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                },
            });
            const data = await response.json();
            console.log(data);
            setUserData(data);
        };

        if (codeParams && localStorage.getItem("accessToken") === null) {
            const getAccessToken = async () => {
                // console.log("inside access Token");
                try {
                    const response = await axios.get("api/auth/getAccessToken?code=" + codeParams, {
                        headers: {
                            mode: "no-cors",
                            credentials: "include"
                        }
                    });

                    // console.log(response);
                    const data = await response.data;
                    // console.log(data);
                    if (data.access_token) {
                        localStorage.setItem("accessToken", data.access_token);
                        setRerender(!rerender);
                    }
                } catch (error) {
                    console.error("Error fetching access token:", error);
                }
            };
            getAccessToken().then(() => {getUserData()});
        } else {
            getUserData();
        }

    }, []);


    // const getUserData = async () => {
    //     const response = await fetch("http://localhost:3001/getUserData", {
    //         method: "GET",
    //         headers: {
    //             "Authorization": "Bearer " + localStorage.getItem("accessToken"), //Bearer AccessToken
    //         }
    //     })
    //     const data = await response.json();
    //     console.log(data);
    //     setUserData(data);
    // }
    useEffect(() => {

    }, []);

    // function loginWithGithub(){
    //     window.location.assign("https://github.com/login/oauth/authorize?client_id="+CLIENT_ID);
    // }

    return (
        <>
        <main className="h-screen flex flex-col justify-center items-center align-items-center text-center">
            <div role="region" aria-label="Login section"
                 className="bg-gradient-to-r from-black to-green-500 w-2/3 p-8 bg-green-300 rounded-full">
                <h1 className={"font-bold text-white text-4xl mb-2"}>Memory Game</h1>

                {/*<Button variant="primary" style={{textAlign: "center"}} onClick={loginWithGithub}>Login With GitHub</Button>*/}
                {localStorage.getItem("accessToken") ?
                    <>
                        {Object.keys(userData).length !== 0 ?
                            <>
                                <div className="font-bold text-white">Welcome, {userData.login}</div>
                            </>
                            :
                            <>
                            </>
                        }

                        <button
                            className="border-4 w-48 bg-green-900 hover:bg-emerald-300 text-white font-bold py-2 px-4 border-b-4 border-green-300 hover:border-blue-500 rounded m-6"
                            style={{width: "30%"}} onClick={() => window.location.href = "/instructions"}>How To Play
                        </button>
                        <button
                            className="border-4 w-48 bg-green-900 hover:bg-emerald-300 text-white font-bold py-2 px-4 border-b-4 border-green-300 hover:border-blue-500 rounded m-6"
                            style={{width: "30%"}} onClick={() => window.location.href = "/memory"}>Go Play
                        </button>

                        <button
                            className="border-4 w-48 bg-green-900 hover:bg-emerald-300 text-white font-bold py-2 px-4 border-b-4 border-green-300 hover:border-blue-500 rounded m-6"
                            style={{width: "30%"}} onClick={() => {
                            localStorage.removeItem("accessToken");
                            setRerender(!rerender);
                            window.location.href = "/";
                        }}>Logout
                        </button>

                        {/*<button onClick={getUserData}>Get Data</button>*/}

                    </>
                    :
                    <>
                        <h3 className="font-bold text-white">User is not logged in</h3>
                    </>
                }
            </div>
        </main>
        </>
    );
}

export default Login;
