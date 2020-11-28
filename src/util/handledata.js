import * as hbx from './hitbox.js';
import * as draw from '../util/drawingengine.js';

export function addToUndoStack(strokeObject, type, setUndoStack) {
    let _strokeObject = { ...strokeObject }; // create copy
    _strokeObject.type = type;

    // add to actions stack
    setUndoStack((prev) => {
        let _prev = [...prev];
        _prev.push(_strokeObject);
        return _prev;
    });
}

export function addToStrokeCollection(strokeObject, setStrokeCollection, setHitboxCollection, setUndoStack, wsRef, canvasRef, sendStroke, addToUndo) {
    // draw new stroke
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    draw.drawCurve(ctx, strokeObject);
    // Add stroke to strokeCollection
    setStrokeCollection((prev) => {
        let res = { ...prev };
        res[strokeObject.id] = strokeObject;
        return res;
    });

    // let colorInt = parseInt(ctx.strokeStyle.substring(1), 16);
    if (wsRef.current !== null && sendStroke) {
        wsRef.current.send(JSON.stringify([strokeObject]));
    }

    if (addToUndo) {
        addToUndoStack(strokeObject, "stroke", setUndoStack);
    }
    addToHitboxCollection(strokeObject, setHitboxCollection);
}

export function eraseFromStrokeCollection(ids, setStrokeCollection, setHitboxCollection, wsRef, setUndoStack, setNeedsRedraw, sendStroke, addToUndo) {
    if (typeof ids === "string") {
        let id = {};
        id[ids] = true;
        ids = id;
    }

    if (sendStroke) {
        sendIdsToDelete(ids, wsRef);
    }

    // erase id's strokes from collection
    setStrokeCollection((prev) => {
        let _prev = { ...prev }
        Object.keys(ids).forEach((keyToDel) => {
            if (addToUndo) {
                let strokeObject = prev[keyToDel];
                addToUndoStack(strokeObject, "delete", setUndoStack);
            }
            delete _prev[keyToDel];
        });
        return _prev;
    });
    setNeedsRedraw(x => x + 1); // trigger redraw
    eraseFromHitboxCollection(ids, setHitboxCollection);
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

// Send ids to delete
export function sendIdsToDelete(ids, wsRef) {
    let deleteObjects = Object.keys(ids).map((id) => {
        return { id: id, type: "delete" };
    })

    if (deleteObjects.length > 0 && wsRef.current !== null) {
        wsRef.current.send(JSON.stringify(deleteObjects));
    }
}

export function processMessage(data, setNeedsClear, setStrokeCollection, setHitboxCollection, setUndoStack, setNeedsRedraw, wsRef, canvasRef) {
    const message = JSON.parse(data.data);
    if (message.length === 0) {
        setNeedsClear(x => x + 1);
    }
    else {
        message.forEach((strokeObject) => {
            if (strokeObject.type === "stroke") {
                addToStrokeCollection(strokeObject, setStrokeCollection, setHitboxCollection,
                    setUndoStack, wsRef, canvasRef, false, true);
            }
            else if (strokeObject.type === "delete") {
                eraseFromStrokeCollection(strokeObject.id, setStrokeCollection, setHitboxCollection,
                    wsRef, setUndoStack, setNeedsRedraw, false, true);
            }
        });
    }
}