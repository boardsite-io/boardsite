import * as hbx from './hitbox.js';
import * as draw from '../util/drawingengine.js';

export function processStrokes(strokeObjectArray, processType, setStrokeCollection, setHitboxCollection, setStack, wsRef, canvasRef) {
    strokeObjectArray = [...strokeObjectArray];
    addToStack(strokeObjectArray, processType, setStack, setStrokeCollection); // Redo or Undo Stack (depending on input)

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
            addToStrokeCollection(_strokeObject, setStrokeCollection, setHitboxCollection, canvasRef);
        } else if (_strokeObject.type === "delete") {
            eraseFromStrokeCollection(_strokeObject, setStrokeCollection, setHitboxCollection, canvasRef);
        }

        if (processType !== "message" && processType !== "eraser") {
            sendStrokeObjectArray([_strokeObject], wsRef);
        }
    });
}

export function addToStrokeCollection(strokeObject, setStrokeCollection, setHitboxCollection, canvasRef) {
    // Draw stroke
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    draw.drawCurve(ctx, strokeObject);

    // Add stroke to strokeCollection
    setStrokeCollection((prev) => {
        let _prev = { ...prev };
        if (_prev[strokeObject.pageId] === undefined){
            _prev[strokeObject.pageId] = {};
        }
        _prev[strokeObject.pageId][strokeObject.id] = strokeObject;
        return _prev;
    });

    addToHitboxCollection(strokeObject, setHitboxCollection);
}

export function eraseFromStrokeCollection(strokeObject, setStrokeCollection, setHitboxCollection, canvasRef) {
    let pageId = strokeObject.pageId;
    // erase id from collection
    setStrokeCollection((prev) => {
        let _prev = { ...prev }
        delete _prev[pageId][strokeObject.id];
        return _prev;
    });
    draw.redraw(pageId, canvasRef, setStrokeCollection);
    eraseFromHitboxCollection(strokeObject, setHitboxCollection);
}

export function addToStack(strokeObjectArray, processType, setStack, setStrokeCollection) {
    // processType === "undo"   => setStack = RedoStack
    // else                     => setStack = UndoStack

    let _strokeObjectArray = [...strokeObjectArray]; // create copy

    setStrokeCollection((prev) => {
        _strokeObjectArray.forEach((strokeObject) => {
            if (processType === "undo") { // setStack = RedoStack
                // DO SOMETHING
                //strokeObject["object"] = { ...prev[strokeObject.id] };
            }
            else if (strokeObject.type === "delete") {
                // Fetch and insert the positions array before deletion to make undo / redo of deletions possible
                strokeObject["object"] = { ...prev[strokeObject.id] };
            }
        })
        return prev;
    })

    // add to undo/redo stack
    setStack((prev) => {
        let _prev = [...prev];
        _prev.push(_strokeObjectArray);
        return _prev;
    });
}

/**
 * 
 * @param {function} setHitboxCollection state setting function
 * @param {object} strokeObject stroke object to set hitbox from
 * @param {[number: width, number: height]} boardResolution canvas resolution in pixels
 * @param {number} hitboxAccuracy accuracy in pixels
 */
export function addToHitboxCollection(strokeObject, setHitboxCollection) {
    let positions = strokeObject.position.slice(0); // create copy of positions array
    let id = strokeObject.id; // extract id
    let pageId = strokeObject.pageId;

    setHitboxCollection((prev) => {
        let _prev = { ...prev }
        let pointSkipFactor = 8; // only check every p-th (x,y) position to reduce computational load
        let quadMinPixDist = 64; // quadratic minimum distance between points to be valid for hitbox calculation
        let lineWidth = strokeObject.line_width;
        let hitbox = hbx.getHitbox(positions, pointSkipFactor, quadMinPixDist, lineWidth);

        // insert new hitboxes
        if (_prev[pageId] === undefined){
            _prev[pageId] = {};
        }

        for (let i = 0; i < hitbox.length; i++) {
            let xy = hitbox[i];
            if (_prev[xy] === undefined) {
                _prev[pageId][xy] = {};
            }
            _prev[pageId][xy][id] = true;
        }

        return _prev;
    });
}

// remove id hitboxes from hitbox collection
export function eraseFromHitboxCollection(strokeObject, setHitboxCollection) {
    let pageId = strokeObject.pageId;
    setHitboxCollection((prev) => {
        let _prev = { ...prev };
        Object.keys(_prev[pageId]).forEach((posKey) => {
            Object.keys(strokeObject).forEach((keyToDel) => {
                delete _prev[pageId][posKey][keyToDel];
            });
        });
        return _prev;
    });
}

// Send strokeObjectArray to websocket
export function sendStrokeObjectArray(strokeObjectArray, wsRef) {
    if (strokeObjectArray.length > 0 && wsRef.current !== undefined) {
        wsRef.current.send(JSON.stringify(strokeObjectArray));
    }
}