import * as hbx from './hitbox.js';
import * as draw from './drawingengine.js';

export function addToStrokeCollection(strokeObject, setStrokeCollection, setHitboxCollection, canvasRef) {
    // Draw stroke
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    draw.drawCurve(ctx, strokeObject);

    // Add stroke to strokeCollection
    setStrokeCollection((prev) => {
        let _prev = { ...prev };
        if (_prev[strokeObject.page_id] === undefined) {
            _prev[strokeObject.page_id] = {};
        }
        _prev[strokeObject.page_id][strokeObject.id] = strokeObject;
        return _prev;
    });

    addToHitboxCollection(strokeObject, setHitboxCollection);
}

export function eraseFromStrokeCollection(strokeObject, setStrokeCollection, setHitboxCollection, canvasRef) {
    let pageId = strokeObject.page_id;
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
            let pageId = strokeObject.page_id;
            if (processType === "undo") { // setStack = RedoStack
                // DO SOMETHING
                //strokeObject["object"] = { ...prev[strokeObject.id] };
            }
            else if (strokeObject.type === "delete") {
                // Fetch and insert the positions array before deletion to make undo / redo of deletions possible
                strokeObject["object"] = { ...prev[pageId][strokeObject.id] };
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
    let pageId = strokeObject.page_id;

    setHitboxCollection((prev) => {
        let _prev = { ...prev }
        let pointSkipFactor = 8; // only check every p-th (x,y) position to reduce computational load
        let quadMinPixDist = 64; // quadratic minimum distance between points to be valid for hitbox calculation
        let lineWidth = strokeObject.line_width;
        let hitbox = hbx.getHitbox(positions, pointSkipFactor, quadMinPixDist, lineWidth);

        // insert new hitboxes
        if (_prev[pageId] === undefined) {
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
    let pageId = strokeObject.page_id;
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

export function clearPageData(pageid, setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack) {
    // Delete from strokeCollection
    setStrokeCollection((prev) => {
        delete prev[pageid]
        return prev;
    })

    // Delete from hitboxCollection
    setHitboxCollection((prev) => {
        delete prev[pageid]
        return prev;
    })

    setUndoStack((prev) => {
        let newPrev = [];
        prev.forEach((actionArray, index) => {
            let action = actionArray[0];
            if (action.page_id !== pageid) {
                newPrev.push(prev[index]);
            }
        })
        return newPrev;
    })

    setRedoStack((prev) => {
        let newPrev = [];
        prev.forEach((actionArray, index) => {
            let action = actionArray[0];
            if (action.page_id !== pageid) {
                newPrev.push(prev[index]);
            }
        })
        return newPrev;
    })
}

export function getCanvasIndex(pageId, pageCollection) {
    let idx = 0;
    pageCollection.forEach((page, index) => {
        if (page.pageId === pageId) {
            idx = index;
        }
    })
    return idx;
}

export function deletePageFromCollection(pageId, setPageCollection) {
    setPageCollection((prev) => {
        let idx = getCanvasIndex(pageId, prev);
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    })
}

export function getCanvasRef(pageId, pageCollection) {
    let canvasRef = null;
    pageCollection.forEach((page) => {
        if (page.pageId === pageId) {
            canvasRef = page.canvasRef;
        }
    })
    return canvasRef;
}


