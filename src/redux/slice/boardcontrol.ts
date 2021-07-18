import { createSlice } from "@reduxjs/toolkit"
import { pageType } from "../../constants"
import { BoardPage } from "../../drawing/page"
import {
    DocumentImage,
    Page,
    PageBackground,
    PageCollection,
    Stroke,
} from "../../types"

export interface BoardControlState {
    pageRank: string[]
    pageCollection: PageCollection
    docs: DocumentImage[]
    pageBG: PageBackground
}

const initState: BoardControlState = {
    pageRank: [],
    pageCollection: {},
    docs: [] as DocumentImage[],
    pageBG: pageType.BLANK as PageBackground, // default
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
            const newPageCollection: PageCollection = {}
            newPageRank.forEach((pid: string) => {
                if (
                    Object.prototype.hasOwnProperty.call(
                        state.pageCollection,
                        pid
                    )
                ) {
                    newPageCollection[pid] = state.pageCollection[pid]
                } else {
                    newPageCollection[pid] = new BoardPage(state.pageBG).setID(
                        pid
                    )
                }
            })

            state.pageCollection = newPageCollection
            state.pageRank = newPageRank
        },

        SET_PAGEMETA: (state, action) => {
            const { pageId, meta } = action.payload
            state.pageCollection[pageId]?.updateMeta(meta)
        },

        SET_PAGEBG: (state, action) => {
            const { pageId, style } = action.payload
            state.pageCollection[pageId]?.updateBackground(style)
            state.pageBG = style
        },

        // Add a new page
        ADD_PAGE: (state, action) => {
            const { page, index } = action.payload as {
                page: Page
                index: number
            }
            state.pageCollection[page.pageId] = page
            if (index >= 0) {
                state.pageRank.splice(index, 0, page.pageId)
            } else {
                state.pageRank.push(page.pageId)
            }
        },

        // Clear page
        CLEAR_PAGE: (state, action) => {
            const pageId = action.payload
            state.pageCollection[pageId]?.clear()
        },

        // Delete page
        DELETE_PAGE: (state, action) => {
            const pageId = action.payload
            delete state.pageCollection[pageId]
            state.pageRank.splice(state.pageRank.indexOf(pageId), 1)
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

        SET_PDF: (state, action) => {
            state.docs = action.payload
        },
    },
})

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
    SET_PDF,
    SET_PAGEBG,
} = boardControlSlice.actions

export default boardControlSlice.reducer
