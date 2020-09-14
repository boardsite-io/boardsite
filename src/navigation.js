import React from 'react';
import './index.css';

function Navigation() {
    return (
        <div className="navigation">
            <header>
                <h1>Bread Gang</h1>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/whiteboard">Whiteboard</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </header>
        </div>
    );
}

export default Navigation;