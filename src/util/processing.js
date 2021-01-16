import store from '../redux/store.js';
import {actAddStroke, actEraseStroke} from '../redux/slice/boardcontrol.js';
import * as draw from '../util/drawingengine';

export function processStrokes(strokeObjectArray, processType, ctx) {
    strokeObjectArray = [...strokeObjectArray];
    // store.dispatch(addToStack()); // TODO

    if (processType === "eraser") {
        // sendStrokeObjectArray(strokeObjectArray, wsRef);
        // store.dispatch(sendStrokeObjectArray()); // TODO
    }

    strokeObjectArray.forEach((strokeObject) => {
        let _strokeObject = {...strokeObject};
        if (processType === "undo") {
            if (_strokeObject.type === "stroke") {
                _strokeObject.type = "delete"
            } else if (_strokeObject.type === "delete") {
                _strokeObject = _strokeObject.object
            }
        }

        if (_strokeObject.type === "stroke") {
            draw.drawCurve(ctx, _strokeObject);
            store.dispatch(actAddStroke( _strokeObject));
        } else if (_strokeObject.type === "delete") {
            // actData.eraseFromStrokeCollection(_strokeObject, setBoardInfo, canvasRef);
            // redraw the page
            store.dispatch(actEraseStroke(_strokeObject));
            draw.redraw(_strokeObject.page_id);
        }

        if (processType !== "message" && processType !== "eraser") {
            // sendStrokeObjectArray([_strokeObject], wsRef);
            // store.dispatch(sendStrokeObjectArray()); // TODO
        }
    });
}

// Send strokeObjectArray to websocket
export function sendStrokeObjectArray(strokeObjectArray, wsRef) {
    if (strokeObjectArray.length > 0 && wsRef.current !== undefined) {
        wsRef.current.send(JSON.stringify(strokeObjectArray));
    }
}