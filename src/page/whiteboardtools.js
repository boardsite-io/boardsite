import React, { useState } from 'react';
import { IconButton, Input, Slider } from '@material-ui/core';
import * as api from '../util/api';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import GetAppIcon from '@material-ui/icons/GetApp';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PaletteIcon from '@material-ui/icons/Palette';
import CreateIcon from '@material-ui/icons/Create';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import '../css/toolbar.css';
import { SketchPicker } from 'react-color'
import reactCSS from 'reactcss'

import * as hd from '../util/handledata.js';

// import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
// import RangeSlider from 'react-bootstrap-range-slider';

function WhiteboardTools(props) {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [displayWidthPicker, setDisplayWidthPicker] = useState(false);
    const [color, setColor] = useState({ r: '0', g: '0', b: '0', a: '1', });
    const minWidth = 1;
    const maxWidth = 40;

    function handleClear() {
        props.setNeedsClear(x => x + 1); // Local clear
        api.clearBoard(props.sessionID); // Server clear
    }
    function saveBoard() {
        Object.keys(props.strokeCollection).forEach((key) => {
            let stroke = props.strokeCollection[key];
            console.log(stroke);
        })
    }

    function loadBoard() {
        // props.setNeedsHitboxDebug(x=>x+1);
        console.log(props.undoStack, props.redoStack);
    }

    function handlePrevious() {
        let undo = props.undoStack.pop();
        if (undo !== undefined) {
            let id = undo.id;
            let type = undo.type;
            props.redoStack.push(undo);
            if (type === "stroke") {
                hd.eraseFromStrokeCollection(id, props.setStrokeCollection, props.setHitboxCollection, props.wsRef, props.setUndoStack, props.setNeedsRedraw, true, false);
            } else if (type === "delete"){
                hd.addToStrokeCollection(undo, props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack, props.wsRef, props.canvasRef, true, false);
            }
        }
    }

    function handleNext() {
        let redo = props.redoStack.pop();
        if (redo !== undefined) {
            let id = redo.id;
            let type = redo.type;
            props.undoStack.push(redo);
            if (type === "stroke") {
                hd.addToStrokeCollection(redo, props.setStrokeCollection, props.setHitboxCollection, props.setUndoStack, props.wsRef, props.canvasRef, true, false);
            } else if (type === "delete"){
                hd.eraseFromStrokeCollection(id, props.setStrokeCollection, props.setHitboxCollection, props.wsRef, props.setUndoStack, props.setNeedsRedraw, true, false);
            }
        }
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

    const styles = reactCSS({
        'default': {
            popover: {
                position: 'absolute',
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

    return (
        <div className="toolbar">
            <IconButton id="iconButton" variant="contained" onClick={() => props.setOpen(true)}>
                <GroupAddIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={() => handleClear()}>
                <DeleteForeverIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={() => saveBoard()}>
                <SaveIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={() => loadBoard()}>
                <GetAppIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={() => handlePrevious()}>
                <SkipPreviousIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={() => handleNext()}>
                <SkipNextIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={handlePaletteClick}>
                <PaletteIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={handleWidthClick}>
                <CreateIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            { // Palette Popup
                displayColorPicker ?
                    <div style={styles.popover}>
                        <div style={styles.cover} onClick={handlePaletteClose} />
                        <div className="colorpicker">
                            <SketchPicker disableAlpha={true} color={color} onChange={handlePaletteChange} />
                        </div>
                    </div>
                    : null
            }
            { // Width Slider Popup
                displayWidthPicker ?
                    <div style={styles.popover}>
                        <div style={styles.cover} onClick={handleWidthClose} />
                        <div className="widthpicker">
                            <Slider
                                color="secondary"
                                value={typeof props.lineWidth === 'number' ? props.lineWidth : 0}
                                onChange={handleSliderChange}
                                aria-labelledby="input-slider"
                                min={minWidth}
                                max={maxWidth}
                            />
                            <Input
                                className={styles.input}
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
    );
}
export default WhiteboardTools;