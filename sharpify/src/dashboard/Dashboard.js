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
        input type = "file"
        id = "fileUpload"
        accept = "image/*"
        onChange = {
            (e) => {
                const file = e.target.files[0];
                console.log(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    console.log(e.target.result)
                    const img = new Image();
                    //TODO - Send img through HTTP POST request and enhance the image on the server then draw the enhanced image on the canvas
                    img.onload = () => {
                        console.log('Image loaded');
                        const canvas = document.getElementById('canvas');
                        let imageAspectRatio = img.width / img.height;
                        canvas.width = 800;
                        canvas.height = 800;
                        //console.log(canvas.width, canvas.height);
                        const ctx = canvas.getContext('2d');
                        //console.log(ctx);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height / imageAspectRatio);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }

        }
        /> <
        canvas id = "canvas" > < /canvas> </
        div >
    )
};

export default Dashboard;