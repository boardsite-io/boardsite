import React, { useRef, useEffect } from 'react';

function Whiteboard(props) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const wsRef = useRef(null);

    let isMouseDown = false;
    let sampleCount = 0;
    let lastX = -1;
    let lastY = -1;
    let strokePoints = [];
    

    useEffect(() => {
        // function draw(location, index) {
        //     let x = index % props.blocksPerDim;
        //     let y = (index - index % props.blocksPerDim) / props.blocksPerDim;
        //     let colorInt = location.color;
        //     let color = "#" + colorInt.toString(16).padStart(6, "0");
        //     //console.log("draw: x: " + x + " y: " + y + " c: " + color);
        //     drawFillRect(x * props.blockSize, y * props.blockSize, props.blockSize, props.blockSize, color);
        // }

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth)
        props.strokeCollection.forEach((stroke) => {
            return drawCurve(ctx, stroke, 0.5);
            //return draw(stroke, index);
        })
    }, [props.strokeCollection]) 
    // [props.changeCounter, props.locations, props.blockSize, props.blocksPerDim])

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
        canvasEle.width = 620; //canvasEle.clientWidth;
        canvasEle.height = 877; //canvasEle.clientHeight;

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

    function handleCanvasClick(e) {
        isMouseDown = true;
        sampleCount = 1;
        let canvasElem = document.querySelector("canvas");
        let rect = canvasElem.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        strokePoints = [x,y];

        lastX = x;
        lastY = y;

        // if (e.button === 2) {
        //     drawFillRect(x, y, 50, 50, "#f0f");
        // }
        // else {
        //     drawFillRect(x, y, 50, 50, "#0f0");
        // }

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

    function handleCanvasMove(e) {
        if (isMouseDown) {
            sampleCount += 1;

            let canvasElem = document.querySelector("canvas");
            let rect = canvasElem.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            let moveDist = Math.pow(x-lastX,2) + Math.pow(y-lastY,2); // Quadratic distance moved from last registered point
            
            if (moveDist > 50 && sampleCount > 5) {
                sampleCount = 1;
                strokePoints.push(x, y);
                drawLine(lastX, lastY, x, y, 10, "#000")
                lastX = x;
                lastY = y;
            }
            
        }
    }
    function handleCanvasClickRelease(e) {
        isMouseDown = false;

        let canvasElem = document.querySelector("canvas");
        let rect = canvasElem.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        strokePoints.push(x, y);

        lastX = -1;
        lastY = -1;
        // if (e.button === 2) {
        //     drawFillRect(x, y, 100, 50, "#50f");
        // }
        // else {
        //     drawFillRect(x, y, 20, 100, "#5f5");
        // }

        // Draw interp line
        //var myPoints = [10, 10, 40, 30, 100, 10, 200, 100, 200, 50, 250, 120]; //minimum two points
        // var tension = 0.5;
        // drawCurve(ctxRef.current, strokePoints, tension);

        // Add stroke to strokeCollection
        props.setStrokeCollection(strokeCollection => {
            return [...strokeCollection, strokePoints];
        });
    }

    // draw line
    function drawLine(x1, y1, x2, y2, w, color) {
        ctxRef.current.beginPath();
        ctxRef.current.fillStyle = color;
        ctxRef.current.moveTo(x1, y1);
        ctxRef.current.lineTo(x2, y2);
        ctxRef.current.stroke();
    }

    // draw rectangle with background
    function drawFillRect(x, y, w, h, color) {
        ctxRef.current.beginPath();
        ctxRef.current.fillStyle = color;
        ctxRef.current.fillRect(x, y, w, h);
    }

    // DRAWING FUNCTIONS FROM STACKOVERFLOW

    function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

        ctx.beginPath();

        drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));

        if (showPoints) {
            ctx.beginPath();
            for (var i = 0; i < ptsa.length - 1; i += 2)
                ctx.rect(ptsa[i] - 2, ptsa[i + 1] - 2, 4, 4);
        }

        ctx.stroke();
    }

    function getCurvePoints(pts, tension, isClosed, numOfSegments) {

        // use input value if provided, or use a default value	 
        tension = (typeof tension != 'undefined') ? tension : 0.5;
        isClosed = isClosed ? isClosed : false;
        numOfSegments = numOfSegments ? numOfSegments : 16;

        var _pts = [], res = [],	// clone array
            x, y,			// our x,y coords
            t1x, t2x, t1y, t2y,	// tension vectors
            c1, c2, c3, c4,		// cardinal points
            st, t, i;		// steps based on num. of segments

        // clone array so we don't change the original
        //
        _pts = pts.slice(0);

        // The algorithm require a previous and next point to the actual point array.
        // Check if we will draw closed or open curve.
        // If closed, copy end points to beginning and first points to end
        // If open, duplicate first points to befinning, end points to end
        if (isClosed) {
            _pts.unshift(pts[pts.length - 1]);
            _pts.unshift(pts[pts.length - 2]);
            _pts.unshift(pts[pts.length - 1]);
            _pts.unshift(pts[pts.length - 2]);
            _pts.push(pts[0]);
            _pts.push(pts[1]);
        }
        else {
            _pts.unshift(pts[1]);	//copy 1. point and insert at beginning
            _pts.unshift(pts[0]);
            _pts.push(pts[pts.length - 2]);	//copy last point and append
            _pts.push(pts[pts.length - 1]);
        }

        // ok, lets start..

        // 1. loop goes through point array
        // 2. loop goes through each segment between the 2 pts + 1e point before and after
        for (i = 2; i < (_pts.length - 4); i += 2) {
            for (t = 0; t <= numOfSegments; t++) {

                // calc tension vectors
                t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
                t2x = (_pts[i + 4] - _pts[i]) * tension;

                t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
                t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

                // calc step
                st = t / numOfSegments;

                // calc cardinals
                c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
                c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
                c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
                c4 = Math.pow(st, 3) - Math.pow(st, 2);

                // calc x and y cords with common control vectors
                x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
                y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

                //store points in array
                res.push(x);
                res.push(y);

            }
        }

        return res;
    }

    function drawLines(ctx, pts) {
        ctx.moveTo(pts[0], pts[1]);
        for (var i = 2; i < pts.length - 1; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    }




    return (
        <div websocket={wsRef.current} className="canvasdiv">
            <canvas ref={canvasRef} />
        </div>
    );
}

export default Whiteboard;

