import { createSlice, nanoid } from "@reduxjs/toolkit"

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

        SET_PAGEMETA: (state, action) => {
            const { pageId, meta } = action.payload
            state.pageCollection[pageId].meta = meta
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
            const pageId = action.payload
            // if pageindex is OOB -> pageid is undefined
            if (pageId !== undefined) {
                state.pageCollection[pageId].strokes = {}
            }
        },

        // Delete page
        DELETE_PAGE: (state, action) => {
            const pageId = action.payload
            if (pageId !== undefined) {
                delete state.pageCollection[pageId]
                state.pageRank.splice(state.pageRank.indexOf(pageId), 1)
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
            addStroke(state, stroke)
        },

        // Add multiple strokes to collection
        ADD_MULTIPLE_STROKES: (state, action) => {
            const strokes = action.payload
            strokes.sort((a, b) => a.id > b.id)
            strokes.forEach((stroke) => {
                addStroke(state, stroke)
            })
        },

        // Erase stroke from collection
        ERASE_STROKE(state, action) {
            const { pageId, id } = action.payload
            const page = state.pageCollection[pageId]
            if (page) {
                delete page.strokes[id]
            }
        },

        // Update stroke position after dragging
        UPDATE_STROKE(state, action) {
            const { x, y, id, pageId } = action.payload
            const page = state.pageCollection[pageId]
            if (page) {
                const stroke = page.strokes[id]
                stroke.x = x
                stroke.y = y
            }
        },
    },
})

function addStroke(state, stroke) {
    const { pageId, id } = stroke
    const page = state.pageCollection[pageId]

    if (page) {
        // Add to pageCollection
        page.strokes[id] = stroke
    }
}

export const {
    SYNC_ALL_PAGES,
    SET_PAGERANK,
    ADD_PAGE,
    SET_PAGEMETA,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    ADD_STROKE,
    ADD_MULTIPLE_STROKES,
    ERASE_STROKE,
    UPDATE_STROKE,
} = boardControlSlice.actions

export default boardControlSlice.reducer
