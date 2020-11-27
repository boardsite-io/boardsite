export function addToStrokeCollection(strokeObject, setStrokeCollection, wsRef) {
    // Add stroke to strokeCollection
    setStrokeCollection((prev) => {
        let res = { ...prev };
        res[strokeObject.id] = strokeObject;
        return res;
    });

    // let colorInt = parseInt(ctx.strokeStyle.substring(1), 16);
    if (wsRef.current !== null) {
        wsRef.current.send(JSON.stringify([strokeObject]));
    }
    else {
        console.log("socket not open");
    }
}

export function eraseFromStrokeCollection(ids, setStrokeCollection, setIdOrder, setNeedsRedraw) {
    // erase id's strokes from collection
    setStrokeCollection((prev) => {
        let _prev = { ...prev }
        Object.keys(ids).forEach((keyToDel) => {
            addToUndoStack([keyToDel, "delete"], setIdOrder);
            delete _prev[keyToDel];
        });

        return _prev;
    });
    setNeedsRedraw(x => x + 1); // trigger redraw
}

// action in ["id", "type"] format
export function addToUndoStack(action, setIdOrder) {
    // add to actions stack
    setIdOrder((prev) => {
        let _prev = [...prev];
        _prev.push(action);
        return _prev;
    });
}

// remove id hitboxes from hitbox collection
export function eraseFromHitboxCollection(ids, setHitboxCollection) {
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

