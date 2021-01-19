import { createSlice } from "@reduxjs/toolkit"
import * as draw from "../../component/board/draw.js"
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
            const { pageId, pageIndex } = action.payload
            state.pageCollection[pageId] = {
                strokes: {},
                hitboxes: {},
            }

            if (pageIndex >= 0) {
                state.pageRank.splice(pageIndex, 0, pageId)
            } else {
                state.pageRank.push(pageId)
            }
        },

        // Clear page
        actClearPage: (state, action) => {
            // delete page data
            const pageId = action.payload
            state.pageCollection[pageId] = {}
        },

        // Delete page
        actDeletePage: (state, action) => {
            // delete page data
            const pageId = action.payload
            delete state.pageCollection[pageId]

            // delete page
            const pageIndex = state.pageRank.indexOf(pageId)
            state.pageRank.splice(pageIndex, 1)
        },

        // Delete all pages
        actDeleteAll: (state) => {
            state.pageRank = []
            state.pageCollection = {}
        },

        // Add stroke to collection
        actAddStroke: (state, action) => {
            const stroke = action.payload
            const { page_id, id } = stroke

            // add to collection
            state.pageCollection[page_id].strokes[id] = stroke
        },

        // Erase stroke from collection
        actEraseStroke(state, action) {
            const stroke = action.payload
            const { page_id, id } = stroke
            delete state.pageCollection[page_id].strokes[id]
        },
    },
})

function deletePageData(state, pageId) {
    state.pageCollection[pageId].strokes = {} // does this produce garbage???

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

export const {
    actAddPage,
    actClearPage,
    actDeletePage,
    actDeleteAll,
    actAddStroke,
    actEraseStroke,
} = boardControlSlice.actions
export default boardControlSlice.reducer
