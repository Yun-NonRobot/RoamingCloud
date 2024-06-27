import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import crest from '../../assets/logo.jpg'; // Adjust the path to your logo file
import './ToolPageLayout.css'; // Create and import a CSS file for styling

export default function ToolPageLayout() {
    return (
        <div className="tool-page-layout">
            <Link to="/" className="logo-link">
                <img src={crest} alt="Logo" className="logo" />
            </Link>
            <main className="tool-page-content">
                <Outlet />
            </main>
        </div>
    );
}
