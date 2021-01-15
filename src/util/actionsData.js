import * as hbx from './hitbox.js';
import * as draw from './drawingengine.js';

export function addToStrokeCollection(strokeObject, setBoardInfo, canvasRef) {
    // Draw stroke
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    draw.drawCurve(ctx, strokeObject);


    // Add stroke to strokeCollection
    setBoardInfo((prev) => {
        if (prev.strokeCollection[strokeObject.page_id] === undefined) {
            prev.strokeCollection[strokeObject.page_id] = {};
        }
        prev.strokeCollection[strokeObject.page_id][strokeObject.id] = strokeObject;
        return prev;
    })

    addToHitboxCollection(strokeObject, setBoardInfo);
}

export function eraseFromStrokeCollection(strokeObject, setBoardInfo, canvasRef) {
    let pageId = strokeObject.page_id;
    // erase id from collection
    setBoardInfo((prev) => {
        delete prev.strokeCollection[pageId][strokeObject.id];
        return prev;
    })
    draw.redraw(pageId, canvasRef, setBoardInfo);
    eraseFromHitboxCollection(strokeObject, setBoardInfo);
}

export function addToStack(strokeObjectArray, processType, setBoardInfo) {
    setBoardInfo((prev) => {
        strokeObjectArray.forEach((strokeObject) => {
            let pageId = strokeObject.page_id;
            if (processType === "undo") { // setStack = RedoStack
                //strokeObject["object"] = { ...prev[strokeObject.id] };
            }
            else {
                if (strokeObject.type === "delete") {
                    // Fetch and insert the positions array before deletion to make undo / redo of deletions possible
                    strokeObject["object"] = prev.strokeCollection[pageId][strokeObject.id];
                }
            }
        })

        if (processType === "undo") {
            prev.redoStack.push(strokeObjectArray);
        } else {
            prev.undoStack.push(strokeObjectArray);
        }

        return prev;
    })
}

/**
 * 
 * @param {function} setHitboxCollection state setting function
 * @param {object} strokeObject stroke object to set hitbox from
 * @param {[number: width, number: height]} boardResolution canvas resolution in pixels
 * @param {number} hitboxAccuracy accuracy in pixels
 */
export function addToHitboxCollection(strokeObject, setBoardInfo) {
    let positions = strokeObject.position.slice(0); // create copy of positions array
    let id = strokeObject.id; // extract id
    let pageId = strokeObject.page_id;

    setBoardInfo((prev) => {
        let pointSkipFactor = 8; // only check every p-th (x,y) position to reduce computational load
        let quadMinPixDist = 64; // quadratic minimum distance between points to be valid for hitbox calculation
        let lineWidth = strokeObject.line_width;
        let hitbox = hbx.getHitbox(positions, pointSkipFactor, quadMinPixDist, lineWidth);
        // insert new hitboxes
        if (prev.hitboxCollection[pageId] === undefined) {
            prev.hitboxCollection[pageId] = {};
        }

        for (let i = 0; i < hitbox.length; i++) {
            let xy = hitbox[i];
            if (prev.hitboxCollection[xy] === undefined) {
                prev.hitboxCollection[pageId][xy] = {};
            }
            prev.hitboxCollection[pageId][xy][id] = true;
        }

        return prev;
    })
}

// remove id hitboxes from hitbox collection
export function eraseFromHitboxCollection(strokeObject, setBoardInfo) {
    let pageId = strokeObject.page_id;

    setBoardInfo((prev) => {
        Object.keys(prev.hitboxCollection[pageId]).forEach((posKey) => {
            Object.keys(strokeObject).forEach((keyToDel) => {
                delete prev.hitboxCollection[pageId][posKey][keyToDel];
            });
        });
        return prev;
    })
}

export function clearPageData(pageid, setBoardInfo) {
    setBoardInfo((prev) => {
        delete prev.strokeCollection[pageid];
        delete prev.hitboxCollection[pageid];

        let newUndo = [];
        prev.undoStack.forEach((actionArray, index) => {
            let action = actionArray[0];
            if (action.page_id !== pageid) {
                newUndo.push(prev[index]);
            }
        })
        prev.undoStack = newUndo;

        let newRedo = [];
        prev.redoStack.forEach((actionArray, index) => {
            let action = actionArray[0];
            if (action.page_id !== pageid) {
                newRedo.push(prev[index]);
            }
        })
        prev.redoStack = newRedo;

        return prev;
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


