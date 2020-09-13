import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Boardsite extends React.Component {
    render() {
        return (
            <div className="boardsite">
                <head>
                    <title>BoardSite</title>
                </head>

                <header>
                    <h1>Bread Gang</h1>
                    <ul>
                        <li><a href="#home">Startseite</a></li>
                        <li><a href="#about">Über</a></li>
                        <li><a href="#contact">Kontakt</a></li>
                    </ul>
                </header>
                <body>
                    <h2>WhiteBOIrd</h2>
                    <p>
                        This rad website is going to take over the internet 
                        with PogChamp functionalities and sonic speed nasa performance XDXD.
                    </p>
                    le ESKETIT
                </body>
                <footer>
                    Certified Footer 4Head
                </footer>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Boardsite />,
    document.getElementById('root')
);
