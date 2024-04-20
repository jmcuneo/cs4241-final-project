import { useEffect } from "react";
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

function Dashboard(props) {
    const navigate = useNavigate();

    return ( <
        div className = "display-container" >
        <
        div className = "top-message" >
        Welcome to the Dashboard!
        <
        /div> <
        canvas id = "canvas" > < /canvas> <
        /div>
    )
};

export default Dashboard;