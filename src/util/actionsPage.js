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

export function deletePage(pageid, setBoardInfo, setPageCollection) {
    actData.clearPageData(pageid, setBoardInfo);
    actData.deletePageFromCollection(pageid, setPageCollection);
}

export function deleteAll(setBoardInfo, setPageCollection) {
    setBoardInfo((prev) => {
        prev.strokeCollection = {};
        prev.hitboxCollection = {};
        prev.undoStack = [];
        prev.redoStack = [];
        return prev;
    })
    setPageCollection([]);
}

export function clearPage(pageid, setBoardInfo, canvasRef) {
    actData.clearPageData(pageid, setBoardInfo);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 2480, 3508);
}

export function clearAll(setBoardInfo, pageCollection) {
    pageCollection.forEach((page) => {
        const canvas = page.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 2480, 3508);
    });

    setBoardInfo((prev) => {
        prev.strokeCollection = {};
        prev.hitboxCollection = {};
        prev.undoStack = [];
        prev.redoStack = [];
        return prev;
    });
}
