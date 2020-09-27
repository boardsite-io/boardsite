import { Button, Container, TextField } from '@material-ui/core';
import React, { useState, useRef, useEffect } from 'react';

// https://developer.aliyun.com/mirror/npm/package/material-ui-rc-color-picker
import ColorPicker from 'material-ui-rc-color-picker';
import 'material-ui-rc-color-picker/assets/index.css';

function Home() {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const colorRef = useRef("#ffffff");
    const [currColor, setCurrColor] = useState(() => null);
    const [locations, setLocations] = useState(() => []);

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth)
        locations.forEach(location => draw(location))
    })

    // initialize the canvas context
    useEffect(() => {
        setCurrColor("#000000");
        colorRef.current.value = "#000000";
        // open socket to patys nasa server
        // var socket = new WebSocket(".../..."); 
        // socket.onmessage = (data) => console.log(JSON.parse(data.data));

        // assign the width and height to canvas
        const canvasEle = canvasRef.current;
        canvasEle.width = 500; //canvasEle.clientWidth;
        canvasEle.height = 500; //canvasEle.clientHeight;

        // get context of the canvas
        ctxRef.current = canvasEle.getContext("2d");
        let canvasElem = document.querySelector("canvas");

        canvasElem.addEventListener("mousedown", (e) => {
            handleCanvasClick(e);
            //socket.send(JSON.stringify([{value: c_id, x: x_id, y: y_id}]))
        });

        canvasElem.addEventListener('contextmenu', event => event.preventDefault());

    }, []);

    // draw rectangle
    // const drawRect = (info, style = {}) => {
    //     const { x, y, w, h } = info;
    //     const { borderColor = 'black', borderWidth = 1 } = style;

    //     ctxRef.current.beginPath();
    //     ctxRef.current.strokeStyle = borderColor;
    //     ctxRef.current.lineWidth = borderWidth;
    //     ctxRef.current.rect(x, y, w, h);
    //     ctxRef.current.stroke();
    // }

    // function drawLine(x1, y1, x2, y2) {
    //     let c = ctxRef.current;
    //     c.beginPath();
    //     c.moveTo(x1,y1);
    //     c.lineTo(x2,y2);
    //     c.stroke();
    // }

    function draw(location) {
        let x = location.x;
        let y = location.y;
        let color = location.color;
        let block_size = 50;
        drawFillRect(x * block_size, y * block_size, block_size, block_size, color);
    }

    function handleClear() {
        setLocations([])
    }

    function handleCanvasClick(e) {
        let block_size = 50;
        let canvasElem = document.querySelector("canvas");
        let rect = canvasElem.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        x = (x - x % block_size) / block_size;
        y = (y - y % block_size) / block_size;

        if (e.button === 0) {
            const color = colorRef.current.value;
            const newLocation = { x: x, y: y, color: color };
            setLocations(locations => [...locations, newLocation]);
        }
        else if (e.button === 2) {
            setLocations(locations => [...locations.splice(0,locations.length-1)]);
        }
    }

    // draw rectangle with background
    function drawFillRect(x, y, w, h, color) {
        ctxRef.current.beginPath();
        ctxRef.current.fillStyle = color;
        ctxRef.current.fillRect(x, y, w, h);
    }

    function onColorChange(color) {
        setCurrColor(color.color);
        colorRef.current.value = color.color;
    }

    return (
        <Container id="container" maxWidth="lg">
            <h1>Home</h1>
            <div className="homediv">
                <div className="canvasdiv">
                    <canvas ref={canvasRef}> </canvas>
                </div>
                <div className="toolbar">
                    <Button id="button" variant="contained" color="primary" onClick={() => handleClear()}>Clear</Button>
                    <Button id="button" variant="contained" color="primary" onClick={() => handleClear()}>Save</Button>
                    <Button id="button" variant="contained" color="primary" onClick={() => handleClear()}>Load</Button>
                    <TextField inputRef={colorRef} id="textfield" label="" variant="outlined" />
                    <div className="colorpicker">
                        <ColorPicker
                            enableAlpha={false}
                            color={currColor}
                            onChange={(color) => onColorChange(color)}
                            onClose={(color) => onColorChange(color)}
                            mode="RGB"
                            placement="topLeft"
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Home;
