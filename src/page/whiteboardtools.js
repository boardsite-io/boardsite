import React, { useRef, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';
import * as api from '../util/api';
import ColorPicker from 'material-ui-rc-color-picker';
import 'material-ui-rc-color-picker/assets/index.css';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddIcon from '@material-ui/icons/Add';
import '../css/toolbar.css';

function WhiteboardTools(props) {
    const strokeStyleRef = useRef("#ffffff");
    const sidRef = useRef(null);

    function handleClear() {
        //props.setStrokeCollection([])
        api.clearBoard(props.sessionID);
    }
    function saveBoard(){
        console.log(props.strokeCollection);
    }

    function loadBoard(){
        
    }
    function onColorChange(color) {
        props.setStrokeStyle(color.color);
        strokeStyleRef.current.value = color.color;
    }

    function handleColorTextFieldChange(e){
        props.setStrokeStyle(e.target.value);
        strokeStyleRef.current.value = e.target.value;
    }

    function handleWidthTextFieldChange(e){
        props.setLineWidth(e.target.value);
    }

    useEffect(() => {
        sidRef.current.value = props.sessionID;
    },[props.sessionID])

    return (
        <div className="toolbar">
            <Button id="button" variant="contained" color="primary" onClick={() => props.setOpen(true)}><AddIcon/></Button>
            <Button id="button" variant="contained" color="primary" onClick={() => handleClear()}><DeleteForeverIcon/></Button>
            <Button id="button" variant="contained" color="primary" onClick={() => saveBoard()}><SaveIcon/></Button>
            <Button id="button" variant="contained" color="primary" onClick={() => loadBoard()}><GetAppIcon/></Button>
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
            <TextField defaultValue={'#000000'} onChange={(e) => handleColorTextFieldChange(e)} inputRef={strokeStyleRef} label="Color" variant="filled" />
            <TextField defaultValue={'3'} onChange={(e) => handleWidthTextFieldChange(e)} label="Width" variant="outlined" />
            <TextField defaultValue={'None'} inputRef={sidRef} variant="outlined" />
        </div>
    );
}
 export default WhiteboardTools;