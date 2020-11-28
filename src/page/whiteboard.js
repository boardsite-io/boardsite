import React, { useEffect } from 'react';

import * as evl from '../util/eventlistener.js';
import * as draw from '../util/drawingengine.js';

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

    // Clear canvas and all collections / stacks
    useEffect(() => {
        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
        props.setStrokeCollection({});
        props.setHitboxCollection({});
        props.setUndoStack([]);
        props.setRedoStack([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.needsClear])

    // redraws full strokeCollection
    useEffect(() => {
        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
        Object.keys(props.strokeCollection).forEach((key) => {
            let strokeObject = props.strokeCollection[key];
            return draw.drawCurve(ctx, strokeObject);
        })
        setContextProps();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.needsRedraw])

    /////////////////////////////////
    // DEBUG: draws hitboxCollection
    useEffect(() => {
        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#00FF00";
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
        Object.keys(props.hitboxCollection).forEach((key) => {
            let xy = JSON.parse("[" + key + "]");
            let x = xy[0];
            let y = xy[1];
            let w = 1;
            let h = 1;
            return draw.drawFillRect(x, y, w, h, ctx);
        })
        setContextProps();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.needsHitboxDebug])
    /////////////////////////////////

    function setContextProps(){
        const canvas = props.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = props.strokeStyle;
        ctx.lineWidth = props.lineWidth;
    }

    return (
        <div className="canvasdiv" websocket={props.wsRef.current}>
            <canvas ref={props.canvasRef} />
        </div>
    );
}

export default Whiteboard;