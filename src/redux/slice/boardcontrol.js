import { createSlice } from "@reduxjs/toolkit";
// import * as constant from '../../constants.js';
// pageCollection: {
//     pageId: {
//         strokes: {
//             strokeID: {strokeobj}
//         }
//         TODO: hitbox???
//     }
// }
        
const boardControlSlice = createSlice({
    name: "boardControl",
    initialState: {
        pageRank: [], // ["id1", "id2", ...]
        pageCollection: {}, // {id1: canvasRef1, id2: canvasRef2, ...}
        sessionID: "",
        websocket: null,
    },
    reducers: {
        // Add a new page
        actAddPage: (state, action) => {
            const { pageId, pageIndex } = action.payload;
            state.pageCollection[pageId] = {
                strokes: {},
                // hitboxes: {}, // TODO
            };

            if (pageIndex >= 0) {
                state.pageRank.splice(pageIndex, 0, pageId);
            } else {
                state.pageRank.push(pageId);
            }
        },

        // Clear page
        actClearPage: (state, action) => {
            // delete page data
            const pageId = action.payload;
            deletePageData(state, pageId);

            // clear canvas
            const canvas = document.getElementById(`${pageId}_main`);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 2480, 3508);
        },

        // Delete page
        actDeletePage: (state, action) => {
            // delete page data
            const pageId = action.payload;
            delete state.pageCollection[pageId];

            // delete page
            const pageIndex = state.pageRank.indexOf(pageId);
            state.pageRank.splice(pageIndex, 1);
        },

        // Delete all pages
        actDeleteAll: (state) => {
            state.pageRank = [];
            state.pageCollection = {};
        },

        // Add stroke to collection
        actAddStroke: (state, action) => {
            const strokeObject = action.payload;
            const pageId = strokeObject.page_id;
            const strokeId = strokeObject.id;

            // add to collection
            state.pageCollection[pageId].strokes[strokeId] = strokeObject;

            // addToHitboxCollection(strokeObject, setBoardInfo);
            // let positions = strokeObject.position.slice(0); // create copy of positions array
            // let id = strokeObject.id; // extract id
            // let pageId = strokeObject.page_id;

            // setBoardInfo((prev) => {
            //     let pointSkipFactor = 8; // only check every p-th (x,y) position to reduce computational load
            //     let quadMinPixDist = 64; // quadratic minimum distance between points to be valid for hitbox calculation
            //     let lineWidth = strokeObject.line_width;
            //     let hitbox = hbx.getHitbox(positions, pointSkipFactor, quadMinPixDist, lineWidth);
            //     // insert new hitboxes
            //     if (prev.hitboxCollection[pageId] === undefined) {
            //         prev.hitboxCollection[pageId] = {};
            //     }

            //     for (let i = 0; i < hitbox.length; i++) {
            //         let xy = hitbox[i];
            //         if (prev.hitboxCollection[xy] === undefined) {
            //             prev.hitboxCollection[pageId][xy] = {};
            //         }
            //         prev.hitboxCollection[pageId][xy][id] = true;
            //     }

            //     return prev;
            // })
        },

        // Erase stroke from collection
        actEraseStroke(state, action) {
            const strokeObject = action.payload;
            const pageId = strokeObject.page_id;
            const strokeId = strokeObject.id;
            delete state.pageCollection[pageId].strokes[strokeId];

            // eraseFromHitboxCollection(strokeObject, setBoardInfo);
            // let pageId = strokeObject.page_id;

            // setBoardInfo((prev) => {
            //     Object.keys(prev.hitboxCollection[pageId]).forEach((posKey) => {
            //         Object.keys(strokeObject).forEach((keyToDel) => {
            //             delete prev.hitboxCollection[pageId][posKey][keyToDel];
            //         });
            //     });
            //     return prev;
            // })
        },
    }
});

function deletePageData(state, pageId) {
    state.pageCollection[pageId].strokes = {}; // does this produce garbage???

    // let newUndo = [];
    // prev.undoStack.forEach((actionArray, index) => {
    //     let action = actionArray[0];
    //     if (action.page_id !== pageid) {
    //         newUndo.push(prev[index]);
    //     }
    // })
    // prev.undoStack = newUndo;

    // let newRedo = [];
    // prev.redoStack.forEach((actionArray, index) => {
    //     let action = actionArray[0];
    //     if (action.page_id !== pageid) {
    //         newRedo.push(prev[index]);
    //     }
    // })
    // prev.redoStack = newRedo;
}

export const {actAddPage, actClearPage, actDeletePage, actDeleteAll, actAddStroke, actEraseStroke} = boardControlSlice.actions;
export default boardControlSlice.reducer;
