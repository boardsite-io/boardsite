import { createRef } from 'react';

export function clearAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection) {
    pageCollection.forEach((page) => {
        const canvas = page.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 1240, 1754);
        setStrokeCollection({});
        setHitboxCollection({});
        setUndoStack([]);
        setRedoStack([]);
        setPageCollection([]);
    });
}

export function addPage(setPageCollection) {
    setPageCollection((prev) => {
        let _prev = [...prev];
        let newPageId = Math.random().toString(36).substring(7);
        let newCanvasRef = createRef();
        let newPage = { canvasRef: newCanvasRef, pageId: newPageId };
        _prev.push(newPage);
        return _prev
    })
}

export function deletePage(pageId, setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection) {
    if (pageCollection.length === 1) {
        clearAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
        return;
    }

    // Delete strokeCollection from page
    setStrokeCollection((prev) => {
        delete prev[pageId]
        return prev;
    })

    // Delete hitboxCollection from page
    setHitboxCollection((prev) => {
        delete prev[pageId]
        return prev;
    })

    setUndoStack((prev) => {
        let newPrev = [];
        prev.forEach((actionArray, index) => {
            let action = actionArray[0];
            if (action.page_id !== pageId) {
                newPrev.push(prev[index]);
            }
        })
        return newPrev;
    })

    setRedoStack((prev) => {
        let newPrev = [];
        prev.forEach((actionArray, index) => {
            let action = actionArray[0];
            if (action.page_id !== pageId) {
                newPrev.push(prev[index]);
            }
        })
        return newPrev;
    })

    // Find page index from id
    pageCollection.forEach((page, index) => {
        if (page.pageId === pageId) {
            // Delete page from pageCollection
            deletePageFromCollection(index);
            return;
        }
    })

    function deletePageFromCollection(index) {
        setPageCollection((prev) => {
            return [...prev.slice(0, index), ...prev.slice(index + 1)];
        })
    }
}