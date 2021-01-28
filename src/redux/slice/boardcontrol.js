import { createSlice } from "@reduxjs/toolkit"
import undoable from "redux-undo"

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
        ADD_PAGE: (state, action) => {
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
        CLEAR_PAGE: (state, action) => {
            // delete page data
            const pageId = action.payload
            state.pageCollection[pageId].strokes = {}
        },

        // Delete page
        DELETE_PAGE: (state, action) => {
            // delete page data
            const pageId = action.payload
            delete state.pageCollection[pageId]

            // delete page
            const pageIndex = state.pageRank.indexOf(pageId)
            state.pageRank.splice(pageIndex, 1)
        },

        // Delete all pages
        DELETE_ALL_PAGES: (state) => {
            state.pageRank = []
            state.pageCollection = {}
        },

        // Add stroke to collection
        ADD_STROKE: (state, action) => {
            const stroke = action.payload
            const { pageId, id } = stroke
            state.pageCollection[pageId].strokes[id] = stroke
        },

        // Erase stroke from collection
        ERASE_STROKE(state, action) {
            const stroke = action.payload
            const { pageId, id } = stroke
            delete state.pageCollection[pageId].strokes[id]
        },

        // Update stroke position after dragging
        UPDATE_STROKE(state, action) {
            const { x, y, id, pageId } = action.payload
            const stroke = state.pageCollection[pageId].strokes[id]
            stroke.x = x
            stroke.y = y
        },
    },
})

export const {
    ADD_PAGE,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    ADD_STROKE,
    ERASE_STROKE,
    UPDATE_STROKE,
} = boardControlSlice.actions

const undoableTodos = undoable(boardControlSlice.reducer)
export default undoableTodos
