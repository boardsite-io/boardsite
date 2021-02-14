import { createSlice, nanoid } from "@reduxjs/toolkit"
import undoable from "redux-undo"

const boardControlSlice = createSlice({
    name: "boardControl",
    initialState: {
        pageRank: [], // ["id1", "id2", ...]
        pageCollection: {}, // {id1: canvasRef1, id2: canvasRef2, ...}
    },
    reducers: {
        SYNC_ALL_PAGES: (state, action) => {
            const { pageRank, pageCollection } = action.payload
            state.pageRank = pageRank
            state.pageCollection = pageCollection
        },

        SET_PAGERANK: (state, action) => {
            const newPageRank = action.payload
            const newPageCollection = {}
            newPageRank.forEach((pid) => {
                if (
                    Object.prototype.hasOwnProperty.call(
                        state.pageCollection,
                        pid
                    )
                ) {
                    newPageCollection[pid] = state.pageCollection[pid]
                } else {
                    newPageCollection[pid] = { strokes: {} }
                }
            })

            state.pageCollection = newPageCollection
            state.pageRank = newPageRank
        },

        // Add a new page
        ADD_PAGE: (state, action) => {
            const pageIndex = action.payload
            const pageId = nanoid(8)
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
            const pageIndex = action.payload
            const pageId = state.pageRank[pageIndex]
            if (pageId !== undefined) {
                state.pageCollection[pageId].strokes = {}
            }
        },

        // Delete page
        DELETE_PAGE: (state, action) => {
            const pageIndex = action.payload
            const pageId = state.pageRank[pageIndex]
            if (pageId !== undefined) {
                delete state.pageCollection[pageId]
                state.pageRank.splice(pageIndex, 1)
            }
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

        // Add multiple strokes to collection
        ADD_MULTIPLE_STROKES: (state, action) => {
            const strokes = action.payload
            strokes.sort((a, b) => a.id > b.id)
            strokes.forEach((stroke) => {
                const { pageId, id } = stroke
                state.pageCollection[pageId].strokes[id] = stroke
            })
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
    SYNC_ALL_PAGES,
    SET_PAGERANK,
    ADD_PAGE,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    ADD_STROKE,
    ADD_MULTIPLE_STROKES,
    ERASE_STROKE,
    UPDATE_STROKE,
} = boardControlSlice.actions

const undoableTodos = undoable(boardControlSlice.reducer)
export default undoableTodos
