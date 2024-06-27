import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import StickyNote from './StickyNote'; // Make sure the path is correct
import './BadgerBudsLanding.css'; // Make sure the path is correct

const getRandomPosition = () => {
    const getRandomCoordinate = (max) => Math.floor(Math.random() * max);
    const x = getRandomCoordinate(window.innerWidth - 300); // Adjust width
    const y = getRandomCoordinate(window.innerHeight - 300); // Adjust height
    return { x, y };
};

export default function BadgerBudsLanding(props) {
    const [stickyNotes, setStickyNotes] = useState([]);

    const addStickyNote = () => {
        if (stickyNotes.length < 8) {
            const position = getRandomPosition();
            setStickyNotes([...stickyNotes, { id: Date.now(), position }]);
        } else {
            alert("Maximum of 8 sticky notes allowed.");
        }
    };

    const removeStickyNote = (id) => {
        setStickyNotes(stickyNotes.filter(note => note.id !== id));
    };

    return (
        <Container fluid className="fullscreen-container">
            <Row>
                <Col className="text-center">
                    <h1>Welcome to RoamingCloud's Alpine Meadow</h1>
                    <p>Select an option from the navigation menu</p>
                </Col>
            </Row>
            <button className="sticky-btn" onClick={addStickyNote}>
                便签
            </button>
            {stickyNotes.map(note => (
                <StickyNote
                    key={note.id}
                    position={note.position}
                    onClose={() => removeStickyNote(note.id)}
                />
            ))}
        </Container>
    );
}
