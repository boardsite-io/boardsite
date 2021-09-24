import { createSlice } from "@reduxjs/toolkit"
import { Stroke } from "drawing/stroke/types"
import { pageType } from "../../constants"
import {
    DocumentImage,
    Page,
    PageBackground,
    PageCollection,
} from "../../types"

export interface BoardControlState {
    pageRank: string[]
    pageCollection: PageCollection
    document: DocumentImage[]
    documentSrc: string | Uint8Array
    pageBG: PageBackground
}

const initState: BoardControlState = {
    pageRank: [],
    pageCollection: {},
    document: [] as DocumentImage[],
    documentSrc: "",
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
            const { pageRank, pageCollection } = action.payload
            state.pageRank = pageRank
            state.pageCollection = pageCollection
        },

        SET_PAGEMETA: (state, action) => {
            const { pageId, meta } = action.payload
            state.pageCollection[pageId]?.updateMeta(meta)
        },

        SET_PAGEBG: (state, action) => {
            const style = action.payload
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
                const stroke = state.pageCollection[pageId]?.strokes[
                    id
                ] as Stroke
                stroke.update({ x, y }, { x: scaleX, y: scaleY })
            })
        },

        SET_PDF: (state, action) => {
            const { pageImages, documentSrc } = action.payload
            state.document = pageImages
            state.documentSrc = documentSrc
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
