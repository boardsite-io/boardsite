import React, { useState } from 'react';
import { Button, IconButton, Input, Slider } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import PaletteIcon from '@material-ui/icons/Palette';
import CreateIcon from '@material-ui/icons/Create';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import AddIcon from '@material-ui/icons/Add';
import { SketchPicker } from 'react-color'

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
            <IconButton id="iconButton" variant="contained" onClick={props.clearAll}>
                <DeleteForeverIcon id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" onClick={() => props.addPage()}>
                <AddIcon id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" onClick={props.handleUndo}>
                <SkipPreviousIcon id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" onClick={props.handleRedo}>
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