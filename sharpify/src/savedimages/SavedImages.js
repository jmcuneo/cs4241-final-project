import { useEffect } from "react";
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import './SavedImages.css';

function Dashboard(props) {
    const navigate = useNavigate();

    return (
        <div className="display-container">
            <div className="top-message">
                Welcome to the Saved Images Page!
            </div>
        </div>
    )
};

export default Dashboard;

