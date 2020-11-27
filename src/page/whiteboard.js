import React, { useRef, useEffect } from 'react';

import * as evl from '../util/eventlistener.js';
import * as draw from '../util/drawingengine.js';
import * as hd from '../util/handledata.js';

function Whiteboard(props) {
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 620; //canvas.clientWidth;
        canvas.height = 877; //canvas.clientHeight;
        canvas.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        canvas.addEventListener("mousedown", (e) => evl.handleCanvasMouseDown(e, canvasRef));
        canvas.addEventListener("mousemove", (e) => evl.handleCanvasMouseMove(e, canvasRef));
        canvas.addEventListener("mouseup", (e) => evl.handleCanvasMouseUp(e, canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setIdOrder, props.setNeedsRedraw));
        canvas.addEventListener("mouseleave", (e) => evl.handleCanvasMouseLeave(e, canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setIdOrder, props.setNeedsRedraw));
        // touch & stylus support
        canvas.addEventListener("touchstart", (e) => evl.handleCanvasMouseDown(e, canvasRef));
        canvas.addEventListener("touchmove", (e) => evl.handleCanvasMouseMove(e, canvasRef));
        canvas.addEventListener("touchend", (e) => evl.handleCanvasMouseUp(e, canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setIdOrder, props.setNeedsRedraw));
        canvas.addEventListener("touchcancel", (e) => evl.handleCanvasMouseLeave(e, canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setIdOrder, props.setNeedsRedraw));

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
        props.setIdOrder([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.needsClear])

    // Processes incoming stroke messages
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        Object.keys(props.strokeMessage).forEach((key) => {
            let strokeObject = props.strokeMessage[key];

            // add to actions stack
            props.setIdOrder((prev) => {
                let _prev = [...prev];
                _prev.push([strokeObject.id, strokeObject.type]);
                return _prev;
            });

            if (strokeObject.type === "stroke") {
                hd.addToStrokeCollection(strokeObject, props.setStrokeCollection, props.wsRef, false)
                hd.addToHitboxCollection(strokeObject, props.setHitboxCollection);
                draw.drawCurve(ctx, strokeObject);
            }
            else if (strokeObject.type === "delete") {
                let id = {};
                id[strokeObject.id] = true;
                hd.eraseFromStrokeCollection(id, props.setStrokeCollection, props.setIdOrder, props.setNeedsRedraw);
                hd.eraseFromHitboxCollection(id, props.setHitboxCollection);
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
            let strokeObject = props.strokeCollection[key];
            return draw.drawCurve(ctx, strokeObject);
        })
        ctx.strokeStyle = props.strokeStyle;
        ctx.lineWidth = props.lineWidth;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.needsRedraw])

    return (
        <div websocket={props.wsRef.current}>
            <canvas ref={canvasRef} />
        </div>
    );
}

export default Whiteboard;

