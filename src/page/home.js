import { Button, Container } from '@material-ui/core';
import React, { useRef, useEffect } from 'react';

function Home() {
    const canvas = useRef();
    let ctx = null;

    // initialize the canvas context
    useEffect(() => {
        // assign the width and height to canvas
        const canvasEle = canvas.current;
        canvasEle.width = 600; //canvasEle.clientWidth;
        canvasEle.height = 400; //canvasEle.clientHeight;

        // get context of the canvas
        ctx = canvasEle.getContext("2d");
        let canvasElem = document.querySelector("canvas");

        canvasElem.addEventListener("mousedown", function (e) {
            let [click_x, click_y] = getMousePosition(canvasElem, e);
            drawRect({ x: click_x, y: click_y, w: 10, h: 10 }, { borderColor: 'blue', borderWidth: 5 });
            //alert(`X:${click_x}, Y:${click_y}`);
        });
    }, []);

    useEffect(() => {
        const r1Info = { x: 20, y: 30, w: 100, h: 50 };
        const r1Style = { borderColor: 'red', borderWidth: 10 };
        drawRect(r1Info, r1Style);

        const r2Info = { x: 100, y: 100, w: 80, h: 150 };
        drawRect(r2Info);

        const r3Info = { x: 250, y: 80, w: 80, h: 120 };
        drawFillRect(r3Info, { backgroundColor: 'green' });

        const r4Info = { x: 200, y: 220, w: 100, h: 50 };
        drawFillRect(r4Info);
    }, []);

    // draw rectangle
    const drawRect = (info, style = {}) => {
        const { x, y, w, h } = info;
        const { borderColor = 'black', borderWidth = 1 } = style;

        ctx.beginPath();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.rect(x, y, w, h);
        ctx.stroke();
    }

    // draw rectangle with background
    const drawFillRect = (info, style = {}) => {
        const { x, y, w, h } = info;
        const { backgroundColor = 'black' } = style;

        ctx.beginPath();
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(x, y, w, h);
    }

    function clearCanvas(){
        let canvasElem = document.querySelector("canvas");
        ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
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
            </div>
            <div>
                <canvas ref={canvas}> </canvas>
            </div>
        </Container>
    );
}

export default Home;
