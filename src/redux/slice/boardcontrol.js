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
                switch (undoStroke.stackType) {
                    case "ADD":
                        deleteStroke(state, undoStroke, true)
                        break
                    case "DELETE":
                        addStroke(state, undoStroke, true)
                        break
                    case "UPDATE":
                        updateStroke(state, undoStroke, true)
                        break
                    default:
                        break
                }
            }
        },

        // Redo
        REDO: (state) => {
            const redoStroke = state.redoStack.pop()
            if (redoStroke) {
                switch (redoStroke.stackType) {
                    case "ADD":
                        deleteStroke(state, redoStroke, false)
                        break
                    case "DELETE":
                        addStroke(state, redoStroke, false)
                        break
                    case "UPDATE":
                        updateStroke(state, redoStroke, false)
                        break
                    default:
                        break
                }
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

const addStroke = (state, stroke, isUndo) => {
    const { pageId, id } = stroke
    const page = state.pageCollection[pageId]

    if (page) {
        if (isUndo) {
            // Add to RedStack
            state.redoStack.push({ ...stroke, stackType: "ADD" })
        } else {
            // Add to UndoStack
            state.undoStack.push({ ...stroke, stackType: "ADD" })
        }

        // Add to pageCollection
        page.strokes[id] = stroke
    }
}

const deleteStroke = (state, stroke, isUndo) => {
    const { pageId, id } = stroke
    const page = state.pageCollection[pageId]

    if (page) {
        if (isUndo) {
            // Add to RedStack
            state.redoStack.push({ ...page.strokes[id], stackType: "DELETE" })
        } else {
            // Add to UndoStack
            state.undoStack.push({ ...page.strokes[id], stackType: "DELETE" })
        }

        // Delete from pageCollection
        delete page.strokes[id]
    }
}

const updateStroke = (state, { x, y, id, pageId }, isUndo) => {
    const page = state.pageCollection[pageId]

    if (page) {
        const stroke = page.strokes[id]

        if (isUndo) {
            // Add to redoStack
            state.redoStack.push({
                x: stroke.x, // Copy old x
                y: stroke.y, // Copy old y
                id,
                pageId,
                stackType: "UPDATE",
            })
        } else {
            // Add to UndoStack
            state.undoStack.push({
                x: stroke.x, // Copy old x
                y: stroke.y, // Copy old y
                id,
                pageId,
                stackType: "UPDATE",
            })
        }

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
