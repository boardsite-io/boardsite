import React, { useRef, useEffect } from 'react';

import * as util from '../util/draw.js';

function Whiteboard(props) {
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 620; //canvas.clientWidth;
        canvas.height = 877; //canvas.clientHeight;
        canvas.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        canvas.addEventListener("mousedown", (e) => util.handleCanvasMouseDown(e, canvasRef, props.wsRef));
        canvas.addEventListener("mousemove", (e) => util.handleCanvasMouseMove(e, canvasRef, props.wsRef));
        canvas.addEventListener("mouseup", (e) => util.handleCanvasMouseUp(e, canvasRef, props.wsRef, props.setStrokeCollection));
        canvas.addEventListener("mouseleave", (e) => util.handleCanvasMouseLeave(e, canvasRef, props.wsRef, props.setStrokeCollection));
        // Touch & stylus support
        canvas.addEventListener("touchstart", (e) => util.handleCanvasMouseDown(e, canvasRef, props.wsRef));
        canvas.addEventListener("touchmove", (e) => util.handleCanvasMouseMove(e, canvasRef, props.wsRef));
        canvas.addEventListener("touchend", (e) => util.handleCanvasMouseUp(e, canvasRef, props.wsRef, props.setStrokeCollection));
        canvas.addEventListener("touchcancel", (e) => util.handleCanvasMouseLeave(e, canvasRef, props.wsRef, props.setStrokeCollection));
        
        return () => {
            canvas.removeEventListener("contextmenu", null);
            canvas.removeEventListener("mousedown", null);
            canvas.removeEventListener("mouseup", null);
            canvas.removeEventListener("mousemove", null);
            canvas.removeEventListener("mouseleave", null);
            // Touch & stylus support
            canvas.removeEventListener("touchstart", null);
            canvas.removeEventListener("touchmove", null);
            canvas.removeEventListener("touchend", null);
            canvas.removeEventListener("touchcancel", null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update stroke attributes in context when their props change
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = props.lineWidth;
        ctx.strokeStyle = props.strokeStyle;
    }, [props.lineWidth, props.strokeStyle])

    // Clear canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
        props.setStrokeCollection({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.needsClear])

    // Draws incoming stroke messages
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        Object.keys(props.strokeMessage).forEach((key) => {
            // [{ id: , type: , line_width: , color: , position: }];
            // TODO: CHECK FOR MESSAGE TYPE CLEAR / NEWSTROKE ETC
            let stroke = props.strokeMessage[key];
            props.setStrokeCollection((prev) => {
                let res = { ...prev };
                res[stroke.id] = stroke;
                return res;
            });
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.line_width;
            return util.drawCurve(ctx, stroke.position);
        })
        ctx.strokeStyle = props.strokeStyle;
        ctx.lineWidth = props.lineWidth;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.strokeMessage])

    return (
        <div websocket={props.wsRef.current} className="canvasdiv">
            <canvas ref={canvasRef} />
        </div>
    );
}

export default Whiteboard;

