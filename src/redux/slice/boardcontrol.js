import { createSlice, nanoid } from "@reduxjs/toolkit"

const boardControlSlice = createSlice({
    name: "boardControl",
    initialState: {
        pageRank: [], // ["id1", "id2", ...]
        pageCollection: {}, // {id1: canvasRef1, id2: canvasRef2, ...}
        redoStack: [],
        undoStack: [],
    },
    reducers: {
        // Undo
        UNDO: (state) => {
            const undoStroke = state.undoStack.pop()
            if (undoStroke) {
                undoStroke.handle(state, undoStroke.stroke)
            }
        },

        // Redo
        REDO: (state) => {
            const redoStroke = state.redoStack.pop()
            if (redoStroke) {
                redoStroke.handle(state, redoStroke.stroke)
            }
        },

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
            const stroke = action.payload
            deleteStroke(state, stroke)
        },

        // Update stroke position after dragging
        UPDATE_STROKE(state, action) {
            const { x, y, id, pageId } = action.payload
            updateStroke(state, { x, y, id, pageId })
        },
    },
})

function addStroke(state, stroke) {
    const { pageId, id } = stroke
    const page = state.pageCollection[pageId]

    if (page) {
        // Add to UndoStack
        state.undoStack.push({
            stroke,
            handle: undoAddStroke,
        })

        // Add to pageCollection
        page.strokes[id] = stroke
    }
}

function deleteStroke(state, { pageId, id }) {
    const page = state.pageCollection[pageId]
    if (page) {
        const stroke = page.strokes[id]
        // Add to UndoStack
        state.undoStack.push({
            stroke,
            handle: undoDeleteStroke,
        })

        // Delete from pageCollection
        delete page.strokes[id]
    }
}

function updateStroke(state, { x, y, id, pageId }) {
    const page = state.pageCollection[pageId]

    if (page) {
        const stroke = page.strokes[id]

        // Add to UndoStack
        state.undoStack.push({
            stroke: { ...stroke }, // make copy to redo update
            handle: undoUpdateStroke,
        })

        // Update x,y position (onDragEnd)
        stroke.x = x
        stroke.y = y
    }
}

function undoAddStroke(state, stroke) {
    const { pageId, id } = stroke
    const page = state.pageCollection[pageId]

    if (page) {
        state.redoStack.push({
            stroke,
            handle: addStroke,
        })
        delete page.strokes[id]
    }
}

function undoDeleteStroke(state, stroke) {
    const { pageId, id } = stroke
    const page = state.pageCollection[pageId]

    if (page) {
        // Add to RedoStack
        state.redoStack.push({
            stroke,
            handle: deleteStroke,
        })
        page.strokes[id] = stroke
    }
}

function undoUpdateStroke(state, { x, y, id, pageId }) {
    const page = state.pageCollection[pageId]

    if (page) {
        const stroke = page.strokes[id]

        // Add to redoStack
        state.redoStack.push({
            stroke: { ...stroke },
            handle: updateStroke,
        })

        // Update x,y position (onDragEnd)
        stroke.x = x
        stroke.y = y
    }
}

export const {
    UNDO,
    REDO,
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

export default boardControlSlice.reducer
