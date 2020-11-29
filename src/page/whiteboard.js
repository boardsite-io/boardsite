import React, { useEffect, useState } from 'react';
import * as evl from '../util/eventlistener.js';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton } from '@material-ui/core';
import reactCSS from 'reactcss'

function Whiteboard(props) {
    const [displaySettings, setDisplaySettings] = useState(false);

    useEffect(() => {
        const canvas = props.canvasRef.current;
        canvas.width = 620; //canvas.clientWidth;
        canvas.height = 877; //canvas.clientHeight;
        canvas.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        canvas.addEventListener("mousedown", (e) => evl.handleCanvasMouseDown(e, props.canvasRef));
        canvas.addEventListener("mousemove", (e) => evl.handleCanvasMouseMove(e, props.canvasRef));
        canvas.addEventListener("mouseup", (e) => evl.handleCanvasMouseUp(e, props.pageId, props.canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack));
        canvas.addEventListener("mouseleave", (e) => evl.handleCanvasMouseLeave(e, props.pageId, props.canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack));
        // touch & stylus support
        canvas.addEventListener("touchstart", (e) => evl.handleCanvasMouseDown(e, props.canvasRef));
        canvas.addEventListener("touchmove", (e) => evl.handleCanvasMouseMove(e, props.canvasRef));
        canvas.addEventListener("touchend", (e) => evl.handleCanvasMouseUp(e, props.pageId, props.canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack));
        canvas.addEventListener("touchcancel", (e) => evl.handleCanvasMouseLeave(e, props.pageId, props.canvasRef, props.wsRef, props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack));

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

    const styles = reactCSS({
        'default': {
            popover: {
                position: 'relative',
                zIndex: '2', // stack order
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    function click() {
        console.log("hi", props.pageId)
        setDisplaySettings(true);
    }

    function handleSettingsClose() {
        setDisplaySettings(false);
    }

    return (
        <div className="page">
            <canvas ref={props.canvasRef} />
            <div>
                <IconButton id="iconButton" variant="contained" onClick={click}>
                    <MoreVertIcon color="secondary" id="iconButtonInner" />
                </IconButton>
                { // Palette Popup
                    displaySettings ?
                        <div style={styles.popover}>
                            <div style={styles.cover} onClick={handleSettingsClose} />
                            <div className="pagesettings">
                                <IconButton id="iconButton" variant="contained" onClick={click} />
                                <IconButton id="iconButton" variant="contained" onClick={click} />
                                <IconButton id="iconButton" variant="contained" onClick={click} />
                                <IconButton id="iconButton" variant="contained" onClick={click} />
                            </div>
                        </div>
                        : null
                }
            </div>
        </div>
    );
}

export default Whiteboard;