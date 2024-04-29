import { useEffect, useState, useRef } from "react";
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import './Dashboard.css';

function Dashboard(props) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const canvasRef = useRef(null);
    const [fileType, setFileType] = useState('');

    function onHandleFileChange(e) {
        const file = e.target.files[0];
        setFileType(file.type.split('/')[1]);

        let formData = new FormData();
        formData.append('image', file);

        const response = fetch('/upload', {
            method: 'POST',
            body: formData

        }).then(response => { response.blob() })
            .then(blob => { console.log(blob) })
            .catch(error => { console.error(error) });

        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setImageSrc(event.target.result);
            setShowModal(true);
        };
        reader.readAsDataURL(file);
    }

    function onHandleCloseModal() {
        setShowModal(false);
    }

    async function onHandleMakeDownloadLink(imageUrl, filename = `sharpified-image.${fileType}`) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = filename;
        downloadLink.click();
    }

    function changeCanvasImage(canvasRef, imageUrl) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
            ctx.drawImage(img, 0, 0);  // Draw the new image on the canvas
        };
        img.src = imageUrl;  // Set the source of the image object to the new image URL
    }

    function sharpify() {
        const label = document.getElementById("hidden-label");
        label.style.display = "block"; 

        if (!imageSrc || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            let imageAspectRatio = img.width / img.height;
            canvas.width = Math.min(800, img.width);
            canvas.height = canvas.width / imageAspectRatio;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('image', blob, 'enhanced-image.png');

                try {
                    const response = await fetch('/sharpify', {
                        method: 'POST',
                        body: formData,
                    });
                    const data = await response.json();
                    onHandleMakeDownloadLink(data.result_url, 'sharpified-image.png');
                    changeCanvasImage(canvasRef, data.result_url);
                } catch (error) {
                    console.error(error);
                } finally {
                    label.style.display = "none";
                }
            });
        };
        img.src = imageSrc;
    }

    return (
        <div className="display-container">
            <div className="sharpify-title">
                Welcome to Sharpify!
            </div>
            <label className="file-input-label">
                Upload an Image!
                <input type="file"
                    id="fileUpload"
                    accept="image/*"
                    onChange={onHandleFileChange}
                    style={{ opacity: 0, width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
                />
            </label>
            <a id="downloadLink" style={{ display: "none" }}>Download Link</a>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <Modal show={showModal} onHide={onHandleCloseModal} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header className="modal-header" closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Sharpify your Image!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', height: 'calc(80vh - 56px)' }}>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={imageSrc} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} alt="Uploaded" />
                    </div>
                    <div className="modal-divider"></div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="sharpify" onClick={sharpify}>Sharpify</div>
                        <label id="hidden-label" style={{ display: 'none' }}>Please wait for your image to be processed...</label>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Dashboard;