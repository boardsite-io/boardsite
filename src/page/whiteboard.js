import React, { useRef, useEffect } from 'react';

function Whiteboard() {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const wsRef = useRef(null);

    let isMouseDown = false;
    let lastX = -1;
    let lastY = -1;

    // useEffect(() => {
    //     function draw(location, index) {
    //         let x = index % props.blocksPerDim;
    //         let y = (index - index % props.blocksPerDim) / props.blocksPerDim;
    //         let colorInt = location.color;
    //         let color = "#" + colorInt.toString(16).padStart(6, "0");
    //         //console.log("draw: x: " + x + " y: " + y + " c: " + color);
    //         drawFillRect(x * props.blockSize, y * props.blockSize, props.blockSize, props.blockSize, color);
    //     }

    //     const canvas = canvasRef.current
    //     const ctx = canvas.getContext('2d')
    //     ctx.clearRect(0, 0, window.innerHeight, window.innerWidth)
    //     props.locations.forEach((location, index) => {
    //         return draw(location, index);
    //     })
    // }, [props.changeCounter, props.locations, props.blockSize, props.blocksPerDim])

    // initialize the canvas context
    useEffect(() => {
        // let isMounted = true;

        // wsRef.current = new WebSocket("ws://heat.port0.org:8000/api/board");
        // wsRef.current.onopen = () => { console.log('connected') }
        // wsRef.current.onmessage = (data) => {
        //     if (isMounted) {
        //         props.setChangeCounter((changeCounter) => changeCounter + 1);
        //         // listen to data sent from the websocket server
        //         const message = JSON.parse(data.data);

        //         let locations = props.locations;
        //         message.forEach(location => {
        //             //console.log(location);
        //             let index = props.blocksPerDim * location.y + location.x
        //             locations[index] = { color: location.color };
        //         })
        //         props.setLocations(locations);
        //     }
        // }

        // wsRef.current.onclose = () => { console.log('disconnected') }

        // // assign the width and height to canvas
        const canvasEle = canvasRef.current;
        // DIN A4	2480 x 3508 Pixel
        canvasEle.width = 1240; //canvasEle.clientWidth;
        canvasEle.height = 1754; //canvasEle.clientHeight;

        // // get context of the canvas
        ctxRef.current = canvasEle.getContext("2d");
        let canvasElem = document.querySelector("canvas");
        canvasElem.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        canvasElem.addEventListener("mousedown", (e) => handleCanvasClick(e));
        canvasElem.addEventListener("mouseup", (e) => handleCanvasClickRelease(e));
        canvasElem.addEventListener("mousemove", (e) => handleCanvasMove(e));
        

        // return () => {
        //     isMounted = false;
        //     canvasElem.removeEventListener("contextmenu", e => e.preventDefault());
        //     canvasElem.removeEventListener("mousedown", (e) => handleCanvasRightClick(e));
        //     wsRef.current.close();
        // };
    }, []);

    function handleCanvasMove(e) {
        if(isMouseDown){
            let canvasElem = document.querySelector("canvas");
            let rect = canvasElem.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            drawLine(lastX, lastY, x, y, 10, "#000")
            lastX = x;
            lastY = y;
        }
    }
    function handleCanvasClickRelease(e) {
        isMouseDown = false;

        let canvasElem = document.querySelector("canvas");
        let rect = canvasElem.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        lastX = -1;
        lastY = -1;
        if (e.button === 2) {
            drawFillRect(x,y,100,50,"#50f");
        }
        else{
            drawFillRect(x,y,20,100,"#5f5");
        }
    }

    function handleCanvasClick(e) {
        isMouseDown = true;
        let canvasElem = document.querySelector("canvas");
        let rect = canvasElem.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        lastX = x;
        lastY = y;

        if (e.button === 2) {
            drawFillRect(x,y,50,50,"#f0f");
        }
        else{
            drawFillRect(x,y,50,50,"#0f0");
        }
        
        // const color = props.currColor;
        // x = (x - x % props.blockSize) / props.blockSize;
        // y = (y - y % props.blockSize) / props.blockSize;
        // let colorInt = parseInt(color.substring(1), 16);
        // // const newLocation = { x: x, y: y, color: colorInt };
        // // props.setLocations(locations => [...locations, newLocation]);

        // if (wsRef.current.readyState === WebSocket.OPEN) {
        //     wsRef.current.send(JSON.stringify([{ x: x, y: y, color: colorInt, action: "juan" }]))
        // }
        // else {
        //     console.log("socket not open");
        // }
    }

    // draw line
    function drawLine(x1, y1, x2, y2, w, color) {
        ctxRef.current.beginPath();
        ctxRef.current.fillStyle = color;
        ctxRef.current.moveTo(x1,y1);
        ctxRef.current.lineTo(x2,y2);
        ctxRef.current.stroke();
    }

    // draw rectangle with background
    function drawFillRect(x, y, w, h, color) {
        ctxRef.current.beginPath();
        ctxRef.current.fillStyle = color;
        ctxRef.current.fillRect(x, y, w, h);
    }

    return (
        <div websocket={wsRef.current} className="canvasdiv">
            <canvas ref={canvasRef} />
        </div>
    );
}

export default Whiteboard;

