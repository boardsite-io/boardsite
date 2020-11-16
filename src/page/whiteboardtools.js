import React, { useRef } from 'react';
import { Button, TextField } from '@material-ui/core';

import ColorPicker from 'material-ui-rc-color-picker';
import 'material-ui-rc-color-picker/assets/index.css';

function WhiteboardTools(props) {
    const colorRef = useRef("#ffffff");

    function handleClear() {
        props.setStrokeCollection([])
    }
    function saveBoard(){
        console.log(props.strokeCollection);
    }

    function loadBoard(){
        
    }
    function onColorChange(color) {
        props.setStrokeStyle(color.color);
        colorRef.current.value = color.color;
    }

    return (
        <div className="toolbar">
            <Button id="button" variant="contained" color="primary" onClick={() => handleClear()}>Clear</Button>
            <Button id="button" variant="contained" color="primary" onClick={() => saveBoard()}>Save</Button>
            <Button id="button" variant="contained" color="primary" onClick={() => loadBoard()}>Load</Button>
            <TextField defaultValue={'#000000'} inputRef={colorRef} id="textfield" label="" variant="outlined" />
            <div className="colorpicker">
                <ColorPicker
                    enableAlpha={false}
                    color={props.strokeStyle}
                    onChange={(color) => onColorChange(color)}
                    onClose={(color) => onColorChange(color)}
                    mode="RGB"
                    placement="topLeft"
                />
            </div>
        </div>
    );
}
 export default WhiteboardTools;