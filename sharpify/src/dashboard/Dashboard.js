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
        </div> <
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

                        let formData = new FormData();
                        formData.append('image', file);
                        const response = fetch("/upload", {
                            method: 'POST',
                            body: formData,
                            }).then(response => {response.blob()})
                                .then(blob => {console.log(blob)})
                                    .catch(error => {console.error(error)});


                        //console.log(ctx);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height / imageAspectRatio);
                        //download image
                        //TODO Make this downloaded image the actual enhanced image not the same image again
                        let downloadLink = document.getElementById('downloadLink');
                        downloadLink.download = 'enhanced-image.png';
                        canvas.toBlob(function(blob) {
                            let url = URL.createObjectURL(blob);
                            downloadLink.href = url;
                            downloadLink.click();
                            URL.revokeObjectURL(url);
                        });
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }

        }
        /> 
        <a id="downloadLink"></a>
        <canvas id = "canvas" > </canvas> </
        div >
    )
};

export default Dashboard;