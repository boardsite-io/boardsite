import React, { useState, useEffect, useRef } from 'react';
import * as evl from '../util/eventlistener.js';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

function Whiteboard(props) {
    const [displayPageSettings, setDisplayPageSettings] = useState(false);
    const liveCanvasRef = useRef();

    function mousedown(e) {
        if (props.isDrawModeRef.current) {
            evl.handleCanvasMouseDown(e, liveCanvasRef, props.canvasRef, props.scaleRef)
        }
    }
    function mousemove(e) {
        if (props.isDrawModeRef.current) {
            evl.handleCanvasMouseMove(e, liveCanvasRef, props.canvasRef, props.scaleRef);
        }
    }
    function mouseup(e) {
        if (props.isDrawModeRef.current) {
            evl.handleCanvasMouseUp(e, liveCanvasRef, props.pageId, props.canvasRef, props.wsRef,
                props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack, props.scaleRef);
        }

    }
    function mouseleave(e) {
        if (props.isDrawModeRef.current) {
            evl.handleCanvasMouseLeave(e, liveCanvasRef, props.pageId, props.canvasRef, props.wsRef,
                props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack, props.scaleRef);
        }
    }

    useEffect(() => {
        const canvas = props.canvasRef.current;
        const liveCanvas = liveCanvasRef.current;
        canvas.width = 1240; //canvas.clientWidth;
        canvas.height = 1754; //canvas.clientHeight;
        liveCanvas.width = 1240; //canvas.clientWidth;
        liveCanvas.height = 1754; //canvas.clientHeight;
        canvas.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        canvas.addEventListener("mousedown", (e) => mousedown(e));
        canvas.addEventListener("mousemove", (e) => mousemove(e));
        canvas.addEventListener("mouseup", (e) => mouseup(e));
        canvas.addEventListener("mouseleave", (e) => mouseleave(e));
        // touch & stylus support
        canvas.addEventListener("touchstart", (e) => mousedown(e));
        canvas.addEventListener("touchmove", (e) => mousemove(e));
        canvas.addEventListener("touchend", (e) => mouseup(e));
        canvas.addEventListener("touchcancel", (e) => mouseleave(e));

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

    function openPageSettings() {
        setDisplayPageSettings(true);
    }

    function closePageSettings() {
        setDisplayPageSettings(false);
    }

    function clearPage() {
        console.log("This should clear the page");
        console.log(props.scaleRef);
    }

    function addPage() {
        console.log("This should add a page");
    }

    return (
        <div className="page">
            <div id="canvasWrapper">
                <canvas id="canvasMain" ref={props.canvasRef} />
                <canvas id="canvasLive" ref={liveCanvasRef} />
            </div>
            <div>
                <IconButton id="iconButton" variant="contained" onClick={openPageSettings}>
                    <MoreVertIcon color="secondary" id="iconButtonInner" />
                </IconButton>
                { // Palette Popup
                    displayPageSettings ?
                        <div className="popup">
                            <div className="cover" onClick={closePageSettings} />
                            <div className="pagesettings">
                                <IconButton id="iconButton" variant="contained" onClick={() => props.deletePage(props.pageId)}>
                                    <DeleteIcon color="secondary" id="iconButtonInner" />
                                </IconButton>
                                <IconButton id="iconButton" variant="contained" onClick={clearPage}>
                                    <ClearIcon color="secondary" id="iconButtonInner" />
                                </IconButton>
                                <IconButton id="iconButton" variant="contained" onClick={addPage}>
                                    <AddIcon color="secondary" id="iconButtonInner" />
                                </IconButton>
                            </div>
                        </div>
                        : null
                }
            </div>
        </div>
    );
}

export default Whiteboard;