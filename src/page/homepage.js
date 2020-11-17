import React, { useState } from 'react';
import { Container, Button, TextField } from '@material-ui/core';
import bean from '../component/mrbean.jpeg';

function HomePage() {
    const [sessionID, setSessionID] = useState("");

    function handleCreate(e) {
        console.log();
    }

    function handleJoin(e) {
        console.log();
    }

    function handleTextFieldChange(e) {
        console.log(e.target.value);
        setSessionID(e.target.value);
    }

    

    return (
        <Container id="container" maxWidth="lg">
            <h1>HomePage XD</h1>
            <div className="homepage">
            <Button variant="contained" 
            color="primary" onClick={() => handleCreate()}>Create Session</Button>
            <Button variant="contained" 
            color="primary" onClick={() => handleJoin()}>Join Session</Button>
            <TextField defaultValue={''} onChange={(e) => handleTextFieldChange(e)}
            label="Insert Session ID" variant="outlined" />

            <img src={bean} alt="mrbeam" />
            </div>
        </Container>
    );
}

export default HomePage;