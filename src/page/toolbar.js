import React, { useState, createRef } from 'react';
import { IconButton, Input, Slider } from '@material-ui/core';
import * as api from '../util/api';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import PaletteIcon from '@material-ui/icons/Palette';
import CreateIcon from '@material-ui/icons/Create';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import AddIcon from '@material-ui/icons/Add';
import { SketchPicker } from 'react-color'

import * as hd from '../util/handledata.js';

// import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
// import RangeSlider from 'react-bootstrap-range-slider';

function Toolbar(props) {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [displayWidthPicker, setDisplayWidthPicker] = useState(false);
    const [color, setColor] = useState({ r: '0', g: '0', b: '0', a: '1', });
    const minWidth = 1;
    const maxWidth = 40;

    function handleClear() {
        props.setNeedsClear(x => x + 1); // Local clear
        api.clearBoard(props.sessionID); // Server clear
    }

    function handleUndo() {
        let undo = props.undoStack.pop();
        if (undo !== undefined) {
            let pageId = undo[0].page_id;
            let canvasRef = getCanvasRef(pageId);
            hd.processStrokes(undo, "undo", props.setStrokeCollection, props.setHitboxCollection,
                props.setRedoStack, props.wsRef, canvasRef);
        }
    }

    function handleRedo() {
        let redo = props.redoStack.pop();
        if (redo !== undefined) {
            let pageId = redo[0].page_id;
            let canvasRef = getCanvasRef(pageId);
            hd.processStrokes(redo, "redo", props.setStrokeCollection, props.setHitboxCollection,
                props.setUndoStack, props.wsRef, canvasRef);
        }
    }

    function getCanvasRef(pageId) {
        let canvasRef = null;
        props.pageCollection.forEach((page) => {
            if (page.pageId === pageId) {
                canvasRef = page.canvasRef;
            }
        })
        return canvasRef;
    }

    function handlePaletteClick() {
        setDisplayColorPicker(!displayColorPicker);
    };

    function handleWidthClick() {
        setDisplayWidthPicker(!displayWidthPicker);
    };

    function handlePaletteClose() {
        setDisplayColorPicker(false);
    };

    function handleWidthClose() {
        setDisplayWidthPicker(false);
    };

    function handlePaletteChange(color) {
        setColor(color.rgb);
        props.setStrokeStyle(color.hex)
    };

    function newPage() {
        props.setPageCollection((prev) => {
            let _prev = [...prev];
            let newPageId = Math.random().toString(36).substring(7);
            let newCanvasRef = createRef();
            let newPage = { canvasRef: newCanvasRef, pageId: newPageId };
            _prev.push(newPage);
            return _prev
        })
    }

    const handleSliderChange = (event, newValue) => {
        props.setLineWidth(newValue);
    };

    const handleInputChange = (event) => {
        props.setLineWidth(event.target.value === '' ? '' : Number(event.target.value));
    };

    // Slider Functions
    const handleBlur = () => {
        if (props.lineWidth < minWidth) {
            props.setLineWidth(minWidth);
        } else if (props.lineWidth > maxWidth) {
            props.setLineWidth(maxWidth);
        }
    };

    return (
        <div className="toolbar">
            <IconButton id="iconButton" variant="contained" onClick={handleClear}>
                <DeleteForeverIcon id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" onClick={newPage}>
                <AddIcon id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" onClick={handleUndo}>
                <SkipPreviousIcon id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" onClick={handleRedo}>
                <SkipNextIcon id="iconButtonInner" />
            </IconButton>
            <div>
                <IconButton id="iconButton" variant="contained" onClick={handlePaletteClick}>
                    <PaletteIcon id="iconButtonInner" />
                </IconButton>
                { // Palette Popup
                    displayColorPicker ?
                        <div className="popup">
                            <div className="cover" onClick={handlePaletteClose} />
                            <div className="colorpicker">
                                <SketchPicker disableAlpha={true} color={color} onChange={handlePaletteChange} />
                            </div>
                        </div>
                        : null
                }
            </div>
            <div>
                <IconButton id="iconButton" variant="contained" onClick={handleWidthClick}>
                    <CreateIcon id="iconButtonInner" />
                </IconButton>
                { // Width Slider Popup
                    displayWidthPicker ?
                        <div className="popup">
                            <div className="cover" onClick={handleWidthClose} />
                            <div className="widthpicker">
                                <Slider
                                    value={typeof props.lineWidth === 'number' ? props.lineWidth : 0}
                                    onChange={handleSliderChange}
                                    aria-labelledby="input-slider"
                                    min={minWidth}
                                    max={maxWidth}
                                />
                                <Input
                                    value={props.lineWidth}
                                    margin="dense"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        step: 10,
                                        min: minWidth,
                                        max: maxWidth,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </div>
                        </div>
                        : null
                }
            </div>
        </div>
    );
}
export default Toolbar;