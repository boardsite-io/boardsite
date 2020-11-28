import * as hbx from './hitbox.js';
import * as draw from '../util/drawingengine.js';

// Send ids to delete
export function sendStrokeObjectArray(strokeObjectArray, wsRef) {
    if (strokeObjectArray.length > 0 && wsRef.current !== null) {
        wsRef.current.send(JSON.stringify(strokeObjectArray));
    }
}

export function processStrokes(strokeObjectArray, processType, setStrokeCollection, setHitboxCollection, setStack, setNeedsRedraw, wsRef, canvasRef) {
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
            eraseFromStrokeCollection(_strokeObject, setStrokeCollection, setHitboxCollection, setNeedsRedraw);
        }

        if (processType !== "message" && processType !== "eraser") {
            sendStrokeObjectArray([_strokeObject], wsRef);
        }
    });
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

export function addToStrokeCollection(strokeObject, setStrokeCollection, setHitboxCollection, canvasRef) {
    // Draw stroke
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    draw.drawCurve(ctx, strokeObject);

    // Add stroke to strokeCollection
    setStrokeCollection((prev) => {
        let _prev = { ...prev };
        _prev[strokeObject.id] = strokeObject;
        return _prev;
    });

    addToHitboxCollection(strokeObject, setHitboxCollection);
}

export function eraseFromStrokeCollection(strokeObject, setStrokeCollection, setHitboxCollection, setNeedsRedraw) {
    if (typeof strokeObject === "string") {
        let id = {};
        id[strokeObject] = true;
        strokeObject = id;
    }

    // erase id from collection
    setStrokeCollection((prev) => {
        let _prev = { ...prev }
        delete _prev[strokeObject.id];
        return _prev;
    });
    setNeedsRedraw(x => x + 1); // trigger redraw
    eraseFromHitboxCollection(strokeObject, setHitboxCollection);
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

    setHitboxCollection((prev) => {
        let _prev = { ...prev }
        let pointSkipFactor = 8; // only check every p-th (x,y) position to reduce computational load
        let quadMinPixDist = 64; // quadratic minimum distance between points to be valid for hitbox calculation
        let lineWidth = strokeObject.line_width;
        let hitbox = hbx.getHitbox(positions, pointSkipFactor, quadMinPixDist, lineWidth);

        // insert new hitboxes
        for (let i = 0; i < hitbox.length; i++) {
            let xy = hitbox[i];
            if (_prev.hasOwnProperty(xy)) { // other ID(s) in this hitbox position
                _prev[xy][id] = true;
            } else { // no other ID in this hitbox position
                _prev[xy] = {};
                _prev[xy][id] = true;
            }
        }

        return _prev;
    });
}

// remove id hitboxes from hitbox collection
export function eraseFromHitboxCollection(ids, setHitboxCollection) {
    if (typeof ids === "string") {
        let id = {};
        id[ids] = true;
        ids = id;
    }

    setHitboxCollection((prev) => {
        let _prev = { ...prev };
        Object.keys(_prev).forEach((posKey) => {
            Object.keys(ids).forEach((keyToDel) => {
                delete _prev[posKey][keyToDel];
            });
        });
        return _prev;
    });
}
