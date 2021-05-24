import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "./redux/store"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export interface Tool {
    type: number
    style: {
        color: string
        width: number
        opacity?: number
    }
}

export interface LiveStroke extends Tool {
    id?: string
    x?: number
    y?: number
    points: number[][]
}

export interface Stroke extends Tool {
    id?: string | undefined
    type: number
    pageId?: string
    x?: number
    y?: number
    points: number[]
    isDraggable?: boolean
    isListening?: boolean
    fillEnabled?: boolean
    perfectDrawEnabled?: boolean
    shadowForStrokeEnabled?: boolean
    currentPageIndex?: number
}

export interface Page {
    strokes: {
        [id: string]: Stroke
    }
    meta: {
        background: PageBackground
    }
}

export interface PageCollection {
    [pid: string]: Page
}

export type Point = {
    x: number
    y: number
}

export type PageBackground = "blank" | "checkered" | "ruled"
