import { createRef } from 'react';
import * as actData from './actionsData.js';

export function addPage(pageid, setPageCollection) {
    setPageCollection((prev) => {
        let _prev = [...prev];
        let newPageId = Math.random().toString(36).substring(7);
        let newCanvasRef = createRef();
        let newPage = { canvasRef: newCanvasRef, pageId: newPageId };

        if (pageid !== undefined) {
            let index = actData.getCanvasIndex(pageid, _prev);
            _prev.splice(index, 0, newPage);
        } else {
            _prev.push(newPage);
        }

        return _prev
    })
}

export function deletePage(pageid, setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, setPageCollection) {
    actData.clearPageData(pageid, setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack);
    actData.deletePageFromCollection(pageid, setPageCollection);
}

export function deleteAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection) {
    pageCollection.forEach((page) => {
        const canvas = page.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 1240, 1754);
    });

    setStrokeCollection({});
    setHitboxCollection({});
    setUndoStack([]);
    setRedoStack([]);
    setPageCollection([]);
}

export function clearPage(pageid, setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, canvasRef) {
    actData.clearPageData(pageid, setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1240, 1754);
}

export function clearAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection) {
    pageCollection.forEach((page) => {
        const canvas = page.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 1240, 1754);
    });

    setStrokeCollection({});
    setHitboxCollection({});
    setUndoStack([]);
    setRedoStack([]);
}
