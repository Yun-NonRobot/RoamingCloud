import React, { useState, useRef, useEffect } from 'react';
import './StickyNote.css';

export default function StickyNote({ onClose, position, backgroundImage }) {
    const [allowMove, setAllowMove] = useState(false);
    const stickyNoteRef = useRef();

    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);

    useEffect(() => {
        stickyNoteRef.current.style.left = `${position.x}px`;
        stickyNoteRef.current.style.top = `${position.y}px`;
    }, [position]);

    function handleMouseDown(e) {
        setAllowMove(true);
        const dimensions = stickyNoteRef.current.getBoundingClientRect();
        setDx(e.clientX - dimensions.x);
        setDy(e.clientY - dimensions.y);
    }

    function handleMouseMove(e) {
        if (allowMove) {
            const x = e.clientX - dx;
            const y = e.clientY - dy;
            stickyNoteRef.current.style.left = x + 'px';
            stickyNoteRef.current.style.top = y + 'px';
        }
    }

    function handleMouseUp() {
        setAllowMove(false);
    }

    function handleMouseLeave() {
        setAllowMove(false);
    }

    return (
        <div
            className="sticky-note"
            ref={stickyNoteRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="sticky-note-header">
                <div>Sticky Note</div>
                <div className="close" onClick={onClose}>
                    &times;
                </div>
            </div>
            <textarea name="" id="" cols="30" rows="10"></textarea>
        </div>
    );
}
