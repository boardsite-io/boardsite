import { Button, Container } from '@material-ui/core';
import React from 'react';

function Home(){
    return (
        <Container maxWidth="lg">
            <h1>Home</h1>
            <Button variant="contained" color="primary" onClick={() => alert("Hello World!")}>Hello</Button>
            <canvas width={640} height={425} />
        </Container>
    );
}

export default Home;
