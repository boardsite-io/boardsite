import React, { useEffect } from 'react';

import * as evl from '../util/eventlistener.js';

function Whiteboard(props) {
    useEffect(() => {
        const canvas = props.canvasRef.current;
        canvas.width = 620; //canvas.clientWidth;
        canvas.height = 877; //canvas.clientHeight;
        canvas.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        canvas.addEventListener("mousedown", (e) => evl.handleCanvasMouseDown(e, props.canvasRef));
        canvas.addEventListener("mousemove", (e) => evl.handleCanvasMouseMove(e, props.canvasRef));
        canvas.addEventListener("mouseup", (e) => evl.handleCanvasMouseUp(e, props.canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack, props.setNeedsRedraw));
        canvas.addEventListener("mouseleave", (e) => evl.handleCanvasMouseLeave(e, props.canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack, props.setNeedsRedraw));
        // touch & stylus support
        canvas.addEventListener("touchstart", (e) => evl.handleCanvasMouseDown(e, props.canvasRef));
        canvas.addEventListener("touchmove", (e) => evl.handleCanvasMouseMove(e, props.canvasRef));
        canvas.addEventListener("touchend", (e) => evl.handleCanvasMouseUp(e, props.canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack, props.setNeedsRedraw));
        canvas.addEventListener("touchcancel", (e) => evl.handleCanvasMouseLeave(e, props.canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack, props.setNeedsRedraw));

        return () => {
            canvas.removeEventListener("contextmenu", null);
            canvas.removeEventListener("mousedown", null);
            canvas.removeEventListener("mouseup", null);
            canvas.removeEventListener("mousemove", null);
            canvas.removeEventListener("mouseleave", null);
            // touch & stylus support
            canvas.removeEventListener("touchstart", null);
            canvas.removeEventListener("touchmove", null);
            canvas.removeEventListener("touchend", null);
            canvas.removeEventListener("touchcancel", null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="canvasdiv" websocket={props.wsRef.current}>
            <canvas ref={props.canvasRef} />
        </div>
    );
}

export default Whiteboard;