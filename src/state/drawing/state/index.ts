import { StrokeCollection, Tool, ToolType } from "drawing/stroke/index.types"
import { PageBackgroundStyle, PageSize } from "redux/board/index.types"
import { GlobalState, RenderTrigger } from "../../index.types"
import { getDefaultDrawingState } from "./default"
import { isDrawType } from "../util"
import {
    DrawingState,
    DrawingSubscribers,
    DrawingSubscription,
} from "./index.types"

export class Drawing implements GlobalState<DrawingState, DrawingSubscribers> {
    state: DrawingState = getDefaultDrawingState()

    subscribers: DrawingSubscribers = {
        directDraw: [],
        toolStyle: [],
        toolType: [],
        favoriteTools: [],
        pageSize: [],
        pageStyle: [],
    }

    setColor(color: string) {
        this.state.tool.style.color = color
        this.render("toolStyle")
    }

    setWidth(width: number) {
        this.state.tool.style.width = width
        this.render("toolStyle")
    }

    toggleDirectDraw() {
        this.state.directDraw = !this.state.directDraw
        this.render("directDraw")
    }

    setErasedStrokes(strokes: StrokeCollection): void {
        Object.keys(strokes).forEach((id) => {
            this.state.erasedStrokes[id] = strokes[id]
        })
    }

    clearErasedStrokes(): void {
        this.state.erasedStrokes = {}
    }

    setPageBackground(style: PageBackgroundStyle) {
        this.state.pageMeta.background.style = style
        this.render("pageStyle")
    }

    setPageSize(size: PageSize) {
        this.state.pageMeta.size = size
        this.render("pageSize")
    }

    setTool(tool: Partial<Tool>): void {
        if (tool.type !== undefined) {
            this.state.tool.type = tool.type

            // Save latest draw type to enable resuming to that tool
            if (isDrawType(tool.type)) {
                this.state.tool.latestDrawType = tool.type
            }

            this.render("toolType")
        }
        if (tool.style !== undefined) {
            this.state.tool.style = { ...tool.style }

            this.render("toolStyle")
        }
    }

    addFavoriteTool() {
        const tool: Tool = {
            type: this.state.tool.type,
            style: { ...this.state.tool.style },
        }

        if (isDrawType(tool.type)) {
            this.state.favoriteTools.push(tool)
            this.render("favoriteTools")
        }
    }

    removeFavoriteTool(index: number) {
        this.state.favoriteTools.splice(index, 1)
        this.render("favoriteTools")
    }

    replaceFavoriteTool(index: number): void {
        const tool: Tool = {
            type: this.state.tool.type,
            style: { ...this.state.tool.style },
        }

        // validate tool candidate
        if (tool.type !== ToolType.Eraser && tool.type !== ToolType.Select) {
            this.state.favoriteTools[index] = tool
            this.render("favoriteTools")
        }
    }

    getState(): DrawingState {
        return this.state
    }

    setState(newState: DrawingState): void {
        this.state = newState
    }

    subscribe(trigger: RenderTrigger, subscription: DrawingSubscription) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(trigger: RenderTrigger, subscription: DrawingSubscription) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(subscription: DrawingSubscription): void {
        this.subscribers[subscription].forEach((render) => {
            render({})
        })
    }
}

export const drawing = new Drawing()
