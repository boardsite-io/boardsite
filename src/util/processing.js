import * as actData from './actionsData.js';

export function processStrokes(strokeObjectArray, processType, setStrokeCollection, setHitboxCollection, setStack, wsRef, canvasRef) {
    strokeObjectArray = [...strokeObjectArray];
    actData.addToStack(strokeObjectArray, processType, setStack, setStrokeCollection); // Redo or Undo Stack (depending on input)

    if (processType === "eraser") {
        sendStrokeObjectArray(strokeObjectArray, wsRef);
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
            actData.addToStrokeCollection(_strokeObject, setStrokeCollection, setHitboxCollection, canvasRef);
        } else if (_strokeObject.type === "delete") {
            actData.eraseFromStrokeCollection(_strokeObject, setStrokeCollection, setHitboxCollection, canvasRef);
        }

        if (processType !== "message" && processType !== "eraser") {
            sendStrokeObjectArray([_strokeObject], wsRef);
        }
    });
}

// Send strokeObjectArray to websocket
export function sendStrokeObjectArray(strokeObjectArray, wsRef) {
    if (strokeObjectArray.length > 0 && wsRef.current !== undefined) {
        wsRef.current.send(JSON.stringify(strokeObjectArray));
    }
}