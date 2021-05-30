import { createSlice, nanoid } from "@reduxjs/toolkit"
import { Page, PageCollection, Stroke } from "../../types"

export interface BoardControlState {
    pageRank: string[]
    pageCollection: PageCollection
}

const initState: BoardControlState = {
    pageRank: [],
    pageCollection: {},
}

const boardControlSlice = createSlice({
    name: "boardControl",
    initialState: initState,
    reducers: {
        SYNC_ALL_PAGES: (state, action) => {
            const { pageRank, pageCollection } = action.payload
            state.pageRank = pageRank
            state.pageCollection = pageCollection
        },

        SET_PAGERANK: (state, action) => {
            const newPageRank = action.payload
            const newPageCollection = {} as PageCollection
            newPageRank.forEach((pid: string) => {
                if (
                    Object.prototype.hasOwnProperty.call(
                        state.pageCollection,
                        pid
                    )
                ) {
                    newPageCollection[pid] = state.pageCollection[pid]
                } else {
                    newPageCollection[pid] = newPageCollectionEntry()
                }
            })

            state.pageCollection = newPageCollection
            state.pageRank = newPageRank
        },

        SET_PAGEMETA: (state, action) => {
            const { pageId, meta } = action.payload
            // update only fields that are different
            state.pageCollection[pageId].meta = {
                ...state.pageCollection[pageId].meta,
                ...meta,
            }
        },

        // Add a new page
        ADD_PAGE: (state, action) => {
            const { pageIndex, meta } = action.payload
            const pageId = nanoid(8)
            state.pageCollection[pageId] = newPageCollectionEntry()
            state.pageCollection[pageId].meta = { ...meta } // if undefined
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

        // Add strokes to collection
        ADD_STROKES: (state, action) => {
            const strokes = action.payload
            strokes.sort((a: Stroke, b: Stroke) => a.id > b.id)
            strokes.forEach((s: Stroke) => {
                const page = state.pageCollection[s.pageId]
                if (page) {
                    page.strokes[s.id] = s
                }
            })
        },

        // Erase strokes from collection
        ERASE_STROKES(state, action) {
            const strokes: Stroke[] = action.payload
            strokes.forEach(({ id, pageId }) => {
                const page = state.pageCollection[pageId]
                if (page) {
                    delete page.strokes[id]
                }
            })
        },

        // Update stroke position after dragging
        UPDATE_STROKES(state, action) {
            const strokes: Stroke[] = action.payload
            strokes.forEach(({ id, pageId, x, y, scaleX, scaleY }) => {
                const page = state.pageCollection[pageId]
                if (page) {
                    // stroke to update
                    const stroke = page.strokes[id]
                    if (stroke) {
                        stroke.update?.({ x, y, scaleX, scaleY } as Stroke)
                    }
                }
            })
        },
    },
})

function newPageCollectionEntry() {
    return {
        strokes: {},
        meta: {},
    } as Page
}

export const {
    SYNC_ALL_PAGES,
    SET_PAGERANK,
    ADD_PAGE,
    SET_PAGEMETA,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    ADD_STROKES,
    ERASE_STROKES,
    UPDATE_STROKES,
} = boardControlSlice.actions

export default boardControlSlice.reducer
