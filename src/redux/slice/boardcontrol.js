import { createSlice } from "@reduxjs/toolkit";
import { createRef } from 'react';

const boardControlSlice = createSlice({
    name: "boardcontrol",
    initialState: {
        pageCollection: {},
        strokeCollection: {},
        hitboxCollection: {},
        undoStack: [],
        redoStack: [],
    
        sessionID: "",
        websocket: null,
    },
    reducers: {
        /**
         * Add a new page to the collection.
         * @param {*} state 
         * @param {*} action 
         */
        addPage: (state, action) => {
            const { pageid, pageIndex } = action.payload;
            const newPage = { 
                canvasRef: createRef(), 
                pageId: pageid 
            };
    
            if (pageIndex !== undefined) {
                state.pageCollection.splice(pageIndex, 0, newPage);
            } else {
                state.pageCollection.push(newPage);
            }
        },

        clearAll: (state) => {
            state.pageCollection.forEach((page) => {
                const canvas = page.canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, 2480, 3508);
            });
        
            state.strokeCollection = {};
            state.hitboxCollection = {};
            state.undoStack = [];
            state.redoStack = [];
        }
    }
});


export const { addPage, clearAll } = boardControlSlice.actions;

export default boardControlSlice.reducer;
