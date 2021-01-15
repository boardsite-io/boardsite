import React, { useState, useEffect, useRef } from 'react';
import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import * as evl from '../util/eventlistener.js';
import * as constant from '../../constants.js';

function Whiteboard(props) {
    const [displayPageSettings, setDisplayPageSettings] = useState(false);
    const liveCanvasRef = useRef();
    const mainCanvasRef = useRef();

    const pageId = props.key;


    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;
        const liveCanvas = liveCanvasRef.current;
        mainCanvas.width = constant.CANVAS_WIDTH; //canvas.clientWidth;
        mainCanvas.height = constant.CANVAS_HEIGHT; //canvas.clientHeight;
        liveCanvas.width = constant.CANVAS_WIDTH; //canvas.clientWidth;
        liveCanvas.height = constant.CANVAS_HEIGHT; //canvas.clientHeight;
        liveCanvas.addEventListener("contextmenu", e => e.preventDefault()); // Disable Context Menu
        liveCanvas.addEventListener("mousedown", (e) => evl.handleCanvasMouseDown(e, liveCanvasRef));
        liveCanvas.addEventListener("mousemove", (e) => evl.handleCanvasMouseMove(e, liveCanvasRef));
        liveCanvas.addEventListener("mouseup", (e) => evl.handleCanvasMouseUp(e, pageId, mainCanvasRef, liveCanvasRef));
        liveCanvas.addEventListener("mouseleave", (e) => evl.handleCanvasMouseLeave(e, pageId, mainCanvasRef, liveCanvasRef));
        // touch & stylus support
        liveCanvas.addEventListener("touchstart", (e) => evl.handleCanvasMouseDown(e, liveCanvasRef));
        liveCanvas.addEventListener("touchmove", (e) => evl.handleCanvasMouseMove(e, liveCanvasRef));
        liveCanvas.addEventListener("touchend", (e) => evl.handleCanvasMouseUp(e, pageId, mainCanvasRef, liveCanvasRef));
        liveCanvas.addEventListener("touchcancel", (e) => evl.handleCanvasMouseLeave(e, pageId, mainCanvasRef, liveCanvasRef));

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
                <canvas id={`${pageId}_live`} ref={liveCanvasRef} />
                <canvas id={`${pageId}_main`} ref={mainCanvasRef} />
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
