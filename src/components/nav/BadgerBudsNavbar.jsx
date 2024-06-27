import React from 'react';
import { Link } from 'react-router-dom';
import crest from '../../assets/logo.jpg';
import './BadgerBudsNavbar.css'; // Import your CSS file

export default function BadgerBudsNavbar(props) {
    return (
        <div className="sidebar-container">
            <div className="sidebar-logo">
                <Link to="/">
                    <img
                        alt="logo"
                        src={crest}
                        className="d-inline-block align-top"
                    />
                </Link>
            </div>
            <nav>
                <Link className="nav-link" to="/tool1">分红&超额误差</Link>
                <Link className="nav-link" to="/tool2">Tool Slot-2</Link>
                <Link className="nav-link" to="/tool3">Tool Slot-3</Link>
                <Link className="nav-link" to="/tool4">Tool Slot-4</Link>
            </nav>
        </div>
    );
}
