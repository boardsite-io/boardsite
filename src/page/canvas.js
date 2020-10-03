import React, { useRef, useEffect } from 'react';

function Canvas(props) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        function draw(location, index) {
            let x = index % props.blocksPerDim;
            let y = (index - index % props.blocksPerDim) / props.blocksPerDim;
            let colorInt = location.color;
            let color = "#" + colorInt.toString(16).padStart(6, "0");
            //console.log("draw: x: " + x + " y: " + y + " c: " + color);
            drawFillRect(x * props.blockSize, y * props.blockSize, props.blockSize, props.blockSize, color);
        }

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth)
        props.locations.forEach((location, index) => {
            return draw(location, index);
        })
    }, [props.changeCounter, props.locations, props.blockSize, props.blocksPerDim])

    // initialize the canvas context
    useEffect(() => {
        let isMounted = true;

        wsRef.current = new WebSocket("ws://heat.port0.org:8000/api/board");
        wsRef.current.onopen = () => { console.log('connected') }
        wsRef.current.onmessage = (data) => {
            if (isMounted) {
                props.setChangeCounter((changeCounter) => changeCounter + 1);
                // listen to data sent from the websocket server
                const message = JSON.parse(data.data);

                let locations = props.locations;
                message.forEach(location => {
                    //console.log(location);
                    let index = props.blocksPerDim * location.y + location.x
                    locations[index] = { color: location.color };
                })
                props.setLocations(locations);
            }
        }

        wsRef.current.onclose = () => { console.log('disconnected') }

        // assign the width and height to canvas
        const canvasEle = canvasRef.current;
        canvasEle.width = props.blockSize * props.blocksPerDim; //canvasEle.clientWidth;
        canvasEle.height = props.blockSize * props.blocksPerDim; //canvasEle.clientHeight;

        // get context of the canvas
        ctxRef.current = canvasEle.getContext("2d");
        let canvasElem = document.querySelector("canvas");
        canvasElem.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        canvasElem.addEventListener("mousedown", (e) => handleCanvasRightClick(e));

        return () => {
            isMounted = false;
            canvasElem.removeEventListener("contextmenu", e => e.preventDefault());
            canvasElem.removeEventListener("mousedown", (e) => handleCanvasRightClick(e));
        };
    }, []);

    function handleCanvasRightClick(e) {
        if (e.button === 2) {
            props.setLocations([]);
        }
    }

    function handleCanvasClick(e) {
        let canvasElem = document.querySelector("canvas");
        let rect = canvasElem.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        const color = props.currColor;
        x = (x - x % props.blockSize) / props.blockSize;
        y = (y - y % props.blockSize) / props.blockSize;
        let colorInt = parseInt(color.substring(1), 16);
        // const newLocation = { x: x, y: y, color: colorInt };
        // props.setLocations(locations => [...locations, newLocation]);

        if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify([{ x: x, y: y, color: colorInt, action: "juan" }]))
        }
        else {
            console.log("socket not open");
        }
    }

    // draw rectangle with background
    function drawFillRect(x, y, w, h, color) {
        ctxRef.current.beginPath();
        ctxRef.current.fillStyle = color;
        ctxRef.current.fillRect(x, y, w, h);
    }

    return (
        <div websocket={wsRef.current} className="canvasdiv">
            <canvas onClick={handleCanvasClick} ref={canvasRef} />
        </div>
    );
}

export default Canvas;