import React, { useRef, useEffect, useState } from 'react';

import * as util from '../util/draw.js';

function Whiteboard(props) {
    const canvasRef = useRef();
    const [needsRedraw, setNeedsRedraw] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 620; //canvas.clientWidth;
        canvas.height = 877; //canvas.clientHeight;
        canvas.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        canvas.addEventListener("mousedown", (e) => util.handleCanvasMouseDown(e, canvasRef));
        canvas.addEventListener("mousemove", (e) => util.handleCanvasMouseMove(e, canvasRef));
        canvas.addEventListener("mouseup", (e) => util.handleCanvasMouseUp(e, canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, setNeedsRedraw));
        canvas.addEventListener("mouseleave", (e) => util.handleCanvasMouseLeave(e, canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, setNeedsRedraw));
        // touch & stylus support
        canvas.addEventListener("touchstart", (e) => util.handleCanvasMouseDown(e, canvasRef));
        canvas.addEventListener("touchmove", (e) => util.handleCanvasMouseMove(e, canvasRef));
        canvas.addEventListener("touchend", (e) => util.handleCanvasMouseUp(e, canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, setNeedsRedraw));
        canvas.addEventListener("touchcancel", (e) => util.handleCanvasMouseLeave(e, canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, setNeedsRedraw));

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
        props.setHitboxCollection({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.needsClear])

    // Processes incoming stroke messages
    useEffect(() => {
        // addHitbox(setHitboxCollection, strokeObject)
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        Object.keys(props.strokeMessage).forEach((key) => {
            let stroke = props.strokeMessage[key];

            if (stroke.type === "stroke") {
                props.setStrokeCollection((prev) => {
                    let res = { ...prev };
                    res[stroke.id] = stroke;
                    return res;
                });
                util.addHitbox(props.setHitboxCollection, stroke);
                ctx.strokeStyle = stroke.color;
                ctx.lineWidth = stroke.line_width;
                util.drawCurve(ctx, stroke.position);
            }
            else if (stroke.type === "delete") {
                // remove deleted id hitboxes from collection 
                props.setHitboxCollection((prev) => {
                    let _prev = { ...prev }
                    Object.keys(_prev).forEach((posKey) => {
                        delete _prev[posKey][stroke.id];
                    });
                    return _prev;
                });

                // erase id's strokes from collection
                props.setStrokeCollection((prev) => {
                    let _prev = { ...prev }
                    delete _prev[stroke.id];
                    return _prev;
                });

                setNeedsRedraw(x => x + 1); // trigger redraw
            }
        })

        ctx.strokeStyle = props.strokeStyle;
        ctx.lineWidth = props.lineWidth;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.strokeMessage])

    // redraws full strokeCollection
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
        Object.keys(props.strokeCollection).forEach((key) => {
            let stroke = props.strokeCollection[key];
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.line_width;
            return util.drawCurve(ctx, stroke.position);
        })
        ctx.strokeStyle = props.strokeStyle;
        ctx.lineWidth = props.lineWidth;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [needsRedraw])

    return (
        <div websocket={props.wsRef.current}>
            <canvas ref={canvasRef} />
        </div>
    );
}

export default Whiteboard;

