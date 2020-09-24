import { Button, Container, TextField } from '@material-ui/core';
import React, { useRef, useEffect } from 'react';

function Home() {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const colorRef = useRef("#ffffff");

    // initialize the canvas context
    useEffect(() => {
        // assign the width and height to canvas
        const canvasEle = canvasRef.current;
        canvasEle.width = 500; //canvasEle.clientWidth;
        canvasEle.height = 500; //canvasEle.clientHeight;

        // get context of the canvas
        ctxRef.current = canvasEle.getContext("2d");
        let canvasElem = document.querySelector("canvas");

        canvasElem.addEventListener("mousedown", (e) => {
            let [click_x, click_y] = getMousePosition(canvasElem, e);
            let block_size = 50;
            click_x = click_x - click_x%block_size;
            click_y = click_y - click_y%block_size;
            console.log(colorRef.current.value)
            drawFillRect({ x: click_x, y: click_y, w: block_size, h: block_size }, { backgroundColor: colorRef.current.value, borderWidth: 0 });
            //alert(`X:${click_x}, Y:${click_y}`);
        });
    }, []);

    // draw rectangle
    const drawRect = (info, style = {}) => {
        const { x, y, w, h } = info;
        const { borderColor = 'black', borderWidth = 1 } = style;

        ctxRef.current.beginPath();
        ctxRef.current.strokeStyle = borderColor;
        ctxRef.current.lineWidth = borderWidth;
        ctxRef.current.rect(x, y, w, h);
        ctxRef.current.stroke();
    }

    // draw rectangle with background
    const drawFillRect = (info, style = {}) => {
        const { x, y, w, h } = info;
        const { backgroundColor = 'black' } = style;

        ctxRef.current.beginPath();
        ctxRef.current.fillStyle = backgroundColor;
        ctxRef.current.fillRect(x, y, w, h);
    }

    function clearCanvas() {
        let canvasElem = document.querySelector("canvas");
        ctxRef.current.clearRect(0, 0, canvasElem.width, canvasElem.height);
    }

    function getMousePosition(canvas, event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        return [x, y];
    }

    return (
        <Container maxWidth="lg">
            <h1>Home</h1>
            <div>
                <Button variant="contained" color="primary" onClick={() => clearCanvas()}>Clear</Button>
                <TextField inputRef={colorRef} id="outlined-basic" label="Input Color Hex #" variant="outlined" />
            </div>
            <div>
                <canvas ref={canvasRef}> </canvas>
            </div>
        </Container>
    );
}

export default Home;
