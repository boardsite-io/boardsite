import { Stroke } from "redux/drawing/drawing.types"
import {
    ZOOM_IN_BUTTON_SCALE,
    ZOOM_OUT_BUTTON_SCALE,
    DEFAULT_CURRENT_PAGE_INDEX,
    DEFAULT_PAGE_HEIGHT,
    DEFAULT_PAGE_WIDTH,
    pageType,
    DEFAULT_STAGE_X,
    DEFAULT_STAGE_Y,
    DEFAULT_STAGE_SCALE,
    DEFAULT_KEEP_CENTERED,
    DEFAULT_HIDE_NAVBAR,
} from "consts"
import { deleteObjectProperty, removeArrayItem } from "redux/helpers"
import {
    centerView,
    detectPageChange,
    fitToPage,
    insertPage,
    multiTouchEnd,
    multiTouchMove,
    zoomToPointWithScale,
} from "./util/helpers"
import { BoardState, PageCollection } from "./board.types"

export const initState: BoardState = {
    currentPageIndex: DEFAULT_CURRENT_PAGE_INDEX,
    pageRank: [],
    pageCollection: {},
    document: [],
    documentSrc: "",
    pageSettings: {
        background: pageType.BLANK, // default,
        width: DEFAULT_PAGE_WIDTH,
        height: DEFAULT_PAGE_HEIGHT,
    },
    view: {
        keepCentered: DEFAULT_KEEP_CENTERED,
        hideNavBar: DEFAULT_HIDE_NAVBAR,
        stageWidth: window.innerWidth,
        stageHeight: window.innerHeight,
        stageX: DEFAULT_STAGE_X,
        stageY: DEFAULT_STAGE_Y,
        stageScale: DEFAULT_STAGE_SCALE,
    },
}

const boardReducer = (state = initState, action: any): BoardState => {
    switch (action.type) {
        case "SYNC_ALL_PAGES": {
            const { pageRank, pageCollection } = action.payload
            return { ...state, pageRank, pageCollection }
        }
        case "SET_PAGERANK": {
            const { pageRank, pageCollection } = action.payload
            return { ...state, pageRank, pageCollection }
        }
        case "SET_PAGEMETA": {
            const { pageId, meta } = action.payload
            const page = state.pageCollection[pageId]
            return {
                ...state,
                pageCollection: {
                    ...state.pageCollection,
                    [pageId]: { ...page, meta: { ...page.meta, ...meta } },
                },
            }
        }
        case "SET_PAGE_BACKGROUND": {
            return {
                ...state,
                pageSettings: {
                    ...state.pageSettings,
                    background: action.payload,
                },
            }
        }
        case "SET_PAGE_WIDTH": {
            return {
                ...state,
                pageSettings: { ...state.pageSettings, width: action.payload },
            }
        }
        case "SET_PAGE_HEIGHT": {
            return {
                ...state,
                pageSettings: { ...state.pageSettings, height: action.payload },
            }
        }
        case "ADD_PAGE": {
            const { page, index } = action.payload
            return {
                ...state,
                pageRank: insertPage(state.pageRank, index, page.pageId),
                pageCollection: {
                    ...state.pageCollection,
                    [page.pageId]: page,
                },
            }
        }
        case "CLEAR_PAGE": {
            const pageId = action.payload
            return {
                ...state,
                pageCollection: {
                    ...state.pageCollection,
                    [pageId]: { ...state.pageCollection[pageId], strokes: {} },
                },
            }
        }
        case "DELETE_PAGE": {
            const pageId = action.payload

            const newPageCollection = deleteObjectProperty(
                pageId,
                state.pageCollection
            ) as PageCollection

            const newPageRank = removeArrayItem(
                state.pageRank,
                state.pageRank.indexOf(pageId)
            ) as string[]

            return {
                ...state,
                pageCollection: newPageCollection,
                pageRank: newPageRank,
            }
        }
        case "DELETE_ALL_PAGES": {
            return { ...state, pageRank: [], pageCollection: {} }
        }
        case "ADD_STROKES": {
            const stateCopy = { ...state }
            const strokes = action.payload
            strokes.sort((a: Stroke, b: Stroke) => a.id > b.id)
            strokes.forEach((stroke: Stroke) => {
                const page = stateCopy.pageCollection[stroke.pageId]
                if (page) {
                    page.strokes[stroke.id] = stroke
                }
            })
            return stateCopy
        }
        case "ERASE_STROKES": {
            const strokes: Stroke[] = action.payload
            strokes.forEach(({ id, pageId }) => {
                const page = state.pageCollection[pageId]
                if (page) {
                    delete page.strokes[id]
                }
            })
            return state
        }
        case "UPDATE_STROKES": {
            const strokes: Stroke[] = action.payload
            const pageCollectionCopy = { ...state.pageCollection }
            strokes.forEach(({ id, pageId, x, y, scaleX, scaleY }) => {
                pageCollectionCopy[pageId].strokes[id] = {
                    ...pageCollectionCopy[pageId].strokes[id],
                    x,
                    y,
                    scaleX,
                    scaleY,
                }
            })
            return { ...state, pageCollection: pageCollectionCopy }
        }
        case "SET_PDF": {
            const { pageImages: document, documentSrc } = action.payload
            return { ...state, document, documentSrc }
        }
        case "JUMP_TO_NEXT_PAGE": {
            if (state.currentPageIndex < state.pageRank.length - 1) {
                state.currentPageIndex += 1
            }
            return state
        }
        case "JUMP_TO_PREV_PAGE": {
            if (state.currentPageIndex > 0) {
                state.currentPageIndex -= 1
            }
            return state
        }
        case "JUMP_TO_FIRST_PAGE": {
            return { ...state, currentPageIndex: 0 }
        }
        case "JUMP_TO_LAST_PAGE": {
            return { ...state, currentPageIndex: state.pageRank.length - 1 }
        }
        case "JUMP_PAGE_WITH_INDEX": {
            const targetIndex = action.payload
            if (targetIndex <= state.pageRank.length - 1 && targetIndex >= 0) {
                return { ...state, currentPageIndex: targetIndex }
            }
            return state
        }
        case "TOGGLE_SHOULD_CENTER": {
            state.view.keepCentered = !state.view.keepCentered
            return state
        }
        case "TOGGLE_HIDE_NAVBAR": {
            state.view.hideNavBar = !state.view.hideNavBar
            return state
        }
        case "MULTI_TOUCH_MOVE": {
            const { p1, p2 } = action.payload
            return { ...state, view: multiTouchMove(state.view, p1, p2) }
        }
        case "MULTI_TOUCH_END": {
            multiTouchEnd()
            return detectPageChange(state)
        }
        case "INITIAL_VIEW": {
            return {
                ...state,
                view: centerView({
                    ...state.view,
                    stageScale: { x: 1, y: 1 },
                    stageX: 0,
                    stageY: DEFAULT_STAGE_Y,
                }),
            }
        }
        case "RESET_VIEW": {
            const oldScale = state.view.stageScale.y
            const newScale = 1
            return {
                ...state,
                view: centerView({
                    ...state.view,
                    stageX: 0,
                    stageY:
                        state.view.stageHeight / 2 -
                        ((state.view.stageHeight / 2 - state.view.stageY) /
                            oldScale) *
                            newScale,
                    stageScale: { x: newScale, y: newScale },
                }),
            }
        }
        case "CENTER_VIEW": {
            return {
                ...state,
                view: centerView(state.view),
            }
        }
        case "SET_STAGE_X": {
            state.view.stageX = action.payload
            return state
        }
        case "SET_STAGE_Y": {
            return detectPageChange({
                ...state,
                view: {
                    ...state.view,
                    stageY: action.payload,
                },
            })
        }
        case "SCROLL_STAGE_Y": {
            return detectPageChange({
                ...state,
                view: {
                    ...state.view,
                    stageY: state.view.stageY - action.payload,
                },
            })
        }
        case "SET_STAGE_SCALE": {
            state.view.stageScale = action.payload
            return state
        }
        case "ON_WINDOW_RESIZE": {
            return {
                ...state,
                view: centerView({
                    ...state.view,
                    stageWidth: window.innerWidth,
                    stageHeight: window.innerHeight,
                }),
            }
        }
        case "FIT_WIDTH_TO_PAGE": {
            return { ...state, view: fitToPage({ ...state.view }) }
        }
        case "ZOOM_TO": {
            const { zoomPoint, zoomScale } = action.payload
            return {
                ...state,
                view: zoomToPointWithScale(
                    { ...state.view },
                    zoomPoint,
                    zoomScale
                ),
            }
        }
        case "ZOOM_IN_CENTER": {
            const centerOfScreen = {
                x: state.view.stageWidth / 2,
                y: state.view.stageHeight / 2,
            }
            return {
                ...state,
                view: zoomToPointWithScale(
                    { ...state.view },
                    centerOfScreen,
                    ZOOM_IN_BUTTON_SCALE
                ),
            }
        }
        case "ZOOM_OUT_CENTER": {
            const centerOfScreen = {
                x: state.view.stageWidth / 2,
                y: state.view.stageHeight / 2,
            }
            return {
                ...state,
                view: zoomToPointWithScale(
                    state.view,
                    centerOfScreen,
                    ZOOM_OUT_BUTTON_SCALE
                ),
            }
        }
        default:
            return state
    }
}
export default boardReducer
