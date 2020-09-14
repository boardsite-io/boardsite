import { Button, Container } from '@material-ui/core';
import React from 'react';

function Home(){
    return (
        <Container maxWidth="md">
            <h1>Home</h1>
            <Button variant="contained" color="primary" onClick={() => alert("Hello World!")}>Hello</Button>
        </Container>
    );
}

export default Home;
