import React, { useState, useEffect, useRef } from 'react';
import * as evl from '../util/eventlistener.js';
import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';

function Whiteboard(props) {
    const [displayPageSettings, setDisplayPageSettings] = useState(false);
    const liveCanvasRef = useRef();

    function mousedown(e) {
        props.setDrawMode((prev) => {
            if (prev) {
                evl.handleCanvasMouseDown(e, liveCanvasRef, props.setBoardInfo)
            }
            return prev;
        })
    }
    function mousemove(e) {
        props.setDrawMode((prev) => {
            if (prev) {
                evl.handleCanvasMouseMove(e, liveCanvasRef);
            }
            return prev;
        })
    }
    function mouseup(e) {
        props.setDrawMode((prev) => {
            if (prev) {
                evl.handleCanvasMouseUp(e, liveCanvasRef, props.pageId, props.canvasRef, props.wsRef,
                    props.setBoardInfo);
            }
            return prev;
        })
    }
    function mouseleave(e) {
        props.setDrawMode((prev) => {
            if (prev) {
                evl.handleCanvasMouseLeave(e, liveCanvasRef, props.pageId, props.canvasRef, props.wsRef,
                    props.setBoardInfo);
            }
            return prev;
        })
    }

    useEffect(() => {
        const canvas = props.canvasRef.current;
        const liveCanvas = liveCanvasRef.current;
        canvas.width = 2480; //canvas.clientWidth;
        canvas.height = 3508; //canvas.clientHeight;
        liveCanvas.width = 2480; //canvas.clientWidth;
        liveCanvas.height = 3508; //canvas.clientHeight;
        liveCanvas.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        liveCanvas.addEventListener("mousedown", (e) => mousedown(e));
        liveCanvas.addEventListener("mousemove", (e) => mousemove(e));
        liveCanvas.addEventListener("mouseup", (e) => mouseup(e));
        liveCanvas.addEventListener("mouseleave", (e) => mouseleave(e));
        // touch & stylus support
        liveCanvas.addEventListener("touchstart", (e) => mousedown(e));
        liveCanvas.addEventListener("touchmove", (e) => mousemove(e));
        liveCanvas.addEventListener("touchend", (e) => mouseup(e));
        liveCanvas.addEventListener("touchcancel", (e) => mouseleave(e));

        return () => {
            liveCanvas.removeEventListener("contextmenu", null);
            liveCanvas.removeEventListener("mousedown", null);
            liveCanvas.removeEventListener("mouseup", null);
            liveCanvas.removeEventListener("mousemove", null);
            liveCanvas.removeEventListener("mouseleave", null);
            // touch & stylus support
            liveCanvas.removeEventListener("touchstart", null);
            liveCanvas.removeEventListener("touchmove", null);
            liveCanvas.removeEventListener("touchend", null);
            liveCanvas.removeEventListener("touchcancel", null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function openPageSettings() {
        setDisplayPageSettings(true);
    }

    function closePageSettings() {
        setDisplayPageSettings(false);
    }

    return (
        <div className="page">
            <div id="canvasWrapper">
                <canvas id="canvasLive" ref={liveCanvasRef} />
                <canvas id="canvasMain" ref={props.canvasRef} />
            </div>
            <div>
                <Tooltip id="tooltip" title="page settings" TransitionProps={{ timeout: 0 }} placement="bottom">
                    <IconButton id="iconButton" variant="contained" onClick={openPageSettings}>
                        <MenuIcon color="secondary" id="iconButtonInner" />
                    </IconButton>
                </Tooltip>
                { // Palette Popup
                    displayPageSettings ?
                        <div className="popup">
                            <div className="cover" onClick={closePageSettings} />
                            <div className="pagesettings">
                                <Tooltip id="tooltip" title="clear Page" TransitionProps={{ timeout: 0 }} placement="left">
                                    <IconButton id="iconButton" variant="contained" onClick={() => {
                                        props.clearPage(props.pageId, props.canvasRef); 
                                        closePageSettings();
                                    }}>
                                        <ClearIcon color="secondary" id="iconButtonInner" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip id="tooltip" title="add page" TransitionProps={{ timeout: 0 }} placement="left">
                                    <IconButton id="iconButton" variant="contained" onClick={() => {
                                        props.addPage(props.pageId)
                                        closePageSettings();
                                    }}>
                                        <AddIcon color="secondary" id="iconButtonInner" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip id="tooltip" title="delete page" TransitionProps={{ timeout: 0 }} placement="left">
                                    <IconButton id="iconButton" variant="contained" onClick={() => {
                                        props.deletePage(props.pageId)
                                        closePageSettings();
                                    }}>
                                        <RemoveIcon color="secondary" id="iconButtonInner" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        : null
                }
            </div>
        </div>
    );
}

export default Whiteboard;