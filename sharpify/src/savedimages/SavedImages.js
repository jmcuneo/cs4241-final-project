import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Image, Modal } from 'react-bootstrap';
// import { Row, Col, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudDownloadAlt } from '@fortawesome/fontawesome-free-solid'
import './SavedImages.css';


function SavedImages(props) {
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        // Fetch the images from your server
        fetch('retrieveImages', {
            credentials: 'include' // Include cookies in the request
        })
            .then(response => response.json())
            .then(data => {
                // Log the fetched images
                console.log(data);

                setImages(data.map(url => ({ url })));
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const handleDownload = (url, filename) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => alert('Something went wrong! We couldn\'t download the file.'));
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Container className="image-row" style={{ marginTop: '4rem' }}>
            {images.map((image, index) => (
                <div key={index} className="image-container">
                    <Image src={image.url} className="saved-image" onClick={() => handleImageClick(image)} />
                </div>
            ))}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedImage && <Image src={selectedImage.url} fluid />}
                </Modal.Body>
                <Modal.Footer>
                    {selectedImage &&
                        // <button onClick={() => handleDownload(selectedImage.url, selectedImage.filename)}>
                        //     <FontAwesomeIcon icon={faCloudDownloadAlt} /> Download
                        // </button>
                        <button onClick={() => handleDownload(selectedImage.url)}>
                            <FontAwesomeIcon icon={faCloudDownloadAlt} /> Download
                        </button>
                    }
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default SavedImages;