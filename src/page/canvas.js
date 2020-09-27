import React, { useRef, useEffect } from 'react';

function Canvas(props) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth)
        props.locations.forEach(location => draw(location))
    })

    // initialize the canvas context
    useEffect(() => {
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
        canvasElem.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        canvasElem.addEventListener("mousedown", (e) => handleCanvasRightClick(e) );

        return () => {
            canvasElem.removeEventListener("contextmenu", e => e.preventDefault());
            canvasElem.removeEventListener("mousedown", (e) => handleCanvasRightClick(e) );
        };
    }, []);

    function handleCanvasRightClick(e) {
        if (e.button === 2) {
            props.setLocations(locations => [...locations.splice(0,locations.length-1)]);
        }
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
            const color = props.currColor;
            const newLocation = { x: x, y: y, color: color };
            props.setLocations(locations => [...locations, newLocation]);
        }
        // else if (e.button === 2) {
        //     props.setLocations(locations => [...locations.splice(0,locations.length-1)]);
        // }

        //socket.send(JSON.stringify([{value: c_id, x: x_id, y: y_id}]))
    }

    function draw(location) {
        let x = location.x;
        let y = location.y;
        let color = location.color;
        let block_size = 50;
        drawFillRect(x * block_size, y * block_size, block_size, block_size, color);
    }

    // draw rectangle with background
    function drawFillRect(x, y, w, h, color) {
        ctxRef.current.beginPath();
        ctxRef.current.fillStyle = color;
        ctxRef.current.fillRect(x, y, w, h);
    }

    return (
        <div className="canvasdiv">
            <canvas onClick={handleCanvasClick} ref={canvasRef} />
        </div>
    );
}

export default Canvas;