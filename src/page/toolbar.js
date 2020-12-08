import React, { useState } from 'react';
import { Button, IconButton, Input, Slider } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import PaletteIcon from '@material-ui/icons/Palette';
import CreateIcon from '@material-ui/icons/Create';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import AddIcon from '@material-ui/icons/Add';
import { SketchPicker } from 'react-color'

import BrushIcon from '@material-ui/icons/Brush';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import Tooltip from '@material-ui/core/Tooltip';

function Toolbar(props) {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [displayWidthPicker, setDisplayWidthPicker] = useState(false);
    const [color, setColor] = useState({ r: '0', g: '0', b: '0', a: '1', });
    const minWidth = 1;
    const maxWidth = 40;

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

    return (
        <div className="toolbar">
            <Button style={{ backgroundColor: "green" }} onClick={props.debug}>
                debug
            </Button>
            <Tooltip id="tooltip" title="delete all pages" TransitionProps={{ timeout: 0 }} placement="right">
                <IconButton id="iconButton" variant="contained" onClick={props.clearAll}>
                    <DeleteForeverIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="add page" TransitionProps={{ timeout: 0 }} placement="right">
                <IconButton id="iconButton" variant="contained" onClick={() => props.addPage()}>
                    <AddIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="undo" TransitionProps={{ timeout: 0 }} placement="right">
                <IconButton id="iconButton" variant="contained" onClick={props.handleUndo}>
                    <UndoIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="redo" TransitionProps={{ timeout: 0 }} placement="right">
                <IconButton id="iconButton" variant="contained" onClick={props.handleRedo}>
                    <RedoIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>



            <Tooltip id="tooltip" title="pen" TransitionProps={{ timeout: 0 }} placement="right">
                {
                    props.activeTool === "pen" ?
                        <IconButton id="iconButtonActive" variant="contained" onClick={() => props.setActiveTool("pen")}>
                            <BrushIcon id="iconButtonActiveInner" />
                        </IconButton>
                        : 
                        <IconButton id="iconButton" variant="contained" onClick={() => props.setActiveTool("pen")}>
                            <BrushIcon id="iconButtonInner" />
                        </IconButton>
                }
            </Tooltip>
            <Tooltip id="tooltip" title="eraser" TransitionProps={{ timeout: 0 }} placement="right">
                {
                    props.activeTool === "eraser" ?
                        <IconButton id="iconButtonActive" variant="contained" onClick={() => props.setActiveTool("eraser")}>
                            <HighlightOffIcon id="iconButtonActiveInner" />
                        </IconButton>
                        :
                        <IconButton id="iconButton" variant="contained" onClick={() => props.setActiveTool("eraser")}>
                            <HighlightOffIcon id="iconButtonInner" />
                        </IconButton>
                }
            </Tooltip>



            <div>
                <Tooltip id="tooltip" title="choose color" TransitionProps={{ timeout: 0 }} placement="right">
                    <IconButton id="iconButton" variant="contained" onClick={handlePaletteClick}>
                        <PaletteIcon id="iconButtonInner" />
                    </IconButton>
                </Tooltip>
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
                <Tooltip id="tooltip" title="choose width" TransitionProps={{ timeout: 0 }} placement="right">
                    <IconButton id="iconButton" variant="contained" onClick={handleWidthClick}>
                        <CreateIcon id="iconButtonInner" />
                    </IconButton>
                </Tooltip>
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