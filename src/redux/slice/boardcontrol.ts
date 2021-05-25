import { createSlice, nanoid } from "@reduxjs/toolkit"
import { Shape, ShapeConfig } from "konva/types/Shape"
import getSelectedIds from "../../drawing/hitboxDetection"

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
        SELECT: (state, action) => {
            const { pageId, x1, y1, x2, y2, trRef, layerRef } = action.payload
            const selectedIds = getSelectedIds(
                state.pageCollection[pageId].strokes,
                x1,
                y1,
                x2,
                y2
            )
            const selectedShapes: Shape<ShapeConfig>[] = []
            layerRef.current
                .find(".shape")
                .forEach((elementNode: Shape<ShapeConfig>) => {
                    for (let i = 0; i < selectedIds.length; i += 1) {
                        if (elementNode.attrs.id === selectedIds[i]) {
                            selectedShapes.push(elementNode)
                            break
                        }
                    }
                })

            trRef.current.nodes(selectedShapes)
        },
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

        // Add stroke to collection
        ADD_STROKE: (state, action) => {
            const stroke = action.payload
            addStroke(state, stroke)
        },

        // Add multiple strokes to collection
        ADD_MULTIPLE_STROKES: (state, action) => {
            const strokes = action.payload
            strokes.sort((a: Stroke, b: Stroke) => a.id > b.id)
            strokes.forEach((stroke: Stroke) => {
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
            const { x, y, id, scaleX, scaleY, pageId } = action.payload
            const page = state.pageCollection[pageId]
            if (page) {
                const stroke = page.strokes[id]
                stroke.scaleX = scaleX
                stroke.scaleY = scaleY
                stroke.x = x
                stroke.y = y
            }
        },
    },
})

function addStroke(state: BoardControlState, stroke: Stroke) {
    const { pageId, id } = stroke
    const page = state.pageCollection[pageId]

    if (page) {
        // Add to pageCollection
        page.strokes[id] = stroke
    }
}

function newPageCollectionEntry() {
    return {
        strokes: {},
        meta: {},
    } as Page
}

export const {
    SELECT,
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
