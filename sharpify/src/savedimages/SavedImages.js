import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudDownloadAlt } from '@fortawesome/fontawesome-free-solid'
import './SavedImages.css';

function SavedImages(props) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchedImages = [
            { id: 1, src: 'image0.jpeg', filename: 'image1.jpeg' },
            { id: 2, src: 'logo192.png', filename: 'image2.png' },
            { id: 3, src: 'logo512.png', filename: 'image3.jpeg' },
            { id: 4, src: 'logo512.png', filename: 'image3.jpeg' },
            { id: 5, src: 'image0.jpeg', filename: 'image1.jpeg' },
            { id: 6, src: 'logo192.png', filename: 'image2.png' },
        ];
        setImages(fetchedImages);
    }, []);

    const handleDownload = (imageSrc, filename) => {
        fetch(imageSrc)
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

    return (
        <Container style={{ marginTop: '4rem' }}>
            <Row>
                {images.map((image, index) => (
                    <Col key={image.id} className="saved-image-column" xs={12} md={4}>
                        <div className="image-container">
                            <img className="saved-image" src={image.src} alt={`image-${index}`} />
                            <button
                                className="download-button"
                                onClick={() => handleDownload(image.src, image.filename)}
                            >
                                <FontAwesomeIcon icon={faCloudDownloadAlt} />
                            </button>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SavedImages;