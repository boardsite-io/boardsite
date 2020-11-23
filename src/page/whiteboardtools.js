import React, { useRef, useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import * as api from '../util/api';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import GetAppIcon from '@material-ui/icons/GetApp';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PaletteIcon from '@material-ui/icons/Palette';
import '../css/toolbar.css';

import { SketchPicker } from 'react-color'
import reactCSS from 'reactcss'

function WhiteboardTools(props) {
    const sidRef = useRef(null);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [color, setColor] = useState({ r: '0', g: '0', b: '0', a: '1', });

    function handleClear() {
        // Local clear
        props.setStrokeCollection({})
        props.setNeedsClear(x => x + 1);
        // Server clear
        api.clearBoard(props.sessionID);
    }
    function saveBoard() {
        console.log(props.strokeCollection);
    }

    function loadBoard() {

    }

    function handleWidthTextFieldChange(e) {
        props.setLineWidth(e.target.value);
    }

    useEffect(() => {
        sidRef.current.value = props.sessionID;
    }, [props.sessionID])

    function handleClick() {
        setDisplayColorPicker(!displayColorPicker);
    };

    function handleClose() {
        setDisplayColorPicker(false);
    };

    function handleChange(color) {
        setColor(color.rgb);
        props.setStrokeStyle(color.hex)
    };

    const styles = reactCSS({
        'default': {
            color: {
                width: '100px',
                height: '20px',
                borderRadius: '5px',
                background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
            },
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
            <Button id="button" variant="contained" color="primary" onClick={() => props.setOpen(true)}><GroupAddIcon color="secondary" /></Button>
            <Button id="button" variant="contained" color="primary" onClick={() => handleClear()}><DeleteForeverIcon color="secondary" /></Button>
            <Button id="button" variant="contained" color="primary" onClick={() => saveBoard()}><SaveIcon color="secondary" /></Button>
            <Button id="button" variant="contained" color="primary" onClick={() => loadBoard()}><GetAppIcon color="secondary" /></Button>
            <Button id="button" variant="contained" color="primary" onClick={handleClick}>
                <PaletteIcon color="secondary" />
            </Button>
            <TextField defaultValue={'3'} onChange={(e) => handleWidthTextFieldChange(e)} label="Width" variant="outlined" />
            <TextField defaultValue={'None'} inputRef={sidRef} variant="outlined" />
            <div className="colorpicker">
                {/* <div style={styles.color}/> */}
                {
                    displayColorPicker ? <div style={styles.popover}>
                        <div style={styles.cover} onClick={handleClose} />
                        <SketchPicker disableAlpha={true} color={color} onChange={handleChange} />
                    </div> : null
                }
            </div>
        </div>
    );
}
export default WhiteboardTools;