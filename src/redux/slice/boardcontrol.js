import { createSlice } from "@reduxjs/toolkit"
import undoable from 'redux-undo'
// import * as constant from '../../constants.js';

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
            state.pageCollection[pageId].strokes = {}
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

export const {
    actAddPage,
    actClearPage,
    actDeletePage,
    actDeleteAll,
    actAddStroke,
    actEraseStroke,
} = boardControlSlice.actions

const undoableTodos = undoable(boardControlSlice.reducer)
export default undoableTodos
