import { StrokeCollection, Tool, ToolType } from "drawing/stroke/index.types"
import { loadLocalStorage, saveLocalStorage } from "storage/local"
import { PageBackgroundStyle, PageSize } from "state/board/state/index.types"
import { GlobalState, RenderTrigger, SerializedState } from "../../index.types"
import { getDefaultDrawingState } from "./default"
import { isDrawType } from "../util"
import {
    DrawingState,
    DrawingSubscriber,
    DrawingSubscribers,
} from "./index.types"
import { deserializeDrawingState, serializeDrawingState } from "../serializers"

export class Drawing implements GlobalState<DrawingState, DrawingSubscribers> {
    state: DrawingState = getDefaultDrawingState()

    subscribers: DrawingSubscribers = {
        ActiveTool: [],
        ColorPicker: [],
        FavoriteTools: [],
        PageBackgroundSetting: [],
        PageSizeMenu: [],
        PageSizeSetting: [],
        PageStyleMenu: [],
        SettingsMenu: [],
        ShapeTools: [],
        ToolRing: [],
        WidthPicker: [],
        useLiveStroke: [],
        useViewControl: [],
    }

    setColor(color: string) {
        this.state.tool.style.color = color
        this.render("ActiveTool", "ColorPicker")
    }

    setWidth(width: number) {
        this.state.tool.style.width = width
        this.render("ActiveTool", "WidthPicker")
    }

    toggleDirectDraw() {
        this.state.directDraw = !this.state.directDraw
        this.render("SettingsMenu")
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
        this.render("PageStyleMenu", "PageBackgroundSetting")
    }

    setPageSize(size: PageSize) {
        this.state.pageMeta.size = size
        this.render("PageSizeMenu", "PageSizeSetting")
    }

    setTool(tool: Partial<Tool>): void {
        if (tool.type !== undefined) {
            this.state.tool.type = tool.type

            // Save latest draw type to enable resuming to that tool
            if (isDrawType(tool.type)) {
                this.state.tool.latestDrawType = tool.type
            }

            this.render(
                "ActiveTool",
                "ToolRing",
                "ShapeTools",
                "useViewControl",
                "useLiveStroke"
            )
        }
        if (tool.style !== undefined) {
            this.state.tool.style = { ...tool.style }

            this.render("ActiveTool", "WidthPicker", "ColorPicker")
        }
    }

    addFavoriteTool() {
        const tool: Tool = {
            type: this.state.tool.type,
            style: { ...this.state.tool.style },
        }

        if (isDrawType(tool.type)) {
            this.state.favoriteTools.push(tool)
            this.render("FavoriteTools")
        }
    }

    removeFavoriteTool(index: number) {
        this.state.favoriteTools.splice(index, 1)
        this.render("FavoriteTools")
    }

    replaceFavoriteTool(index: number): void {
        const tool: Tool = {
            type: this.state.tool.type,
            style: { ...this.state.tool.style },
        }

        // validate tool candidate
        if (tool.type !== ToolType.Eraser && tool.type !== ToolType.Select) {
            this.state.favoriteTools[index] = tool
            this.render("FavoriteTools")
        }
    }

    getState(): DrawingState {
        return this.state
    }

    setState(newState: DrawingState): void {
        this.state = newState
        this.renderAll()
    }

    getSerializedState(): SerializedState<DrawingState> {
        return serializeDrawingState(this.getState())
    }

    async setSerializedState(
        serializedState: SerializedState<DrawingState>
    ): Promise<void> {
        const deserializedState = await deserializeDrawingState(serializedState)
        this.setState(deserializedState)
    }

    saveToLocalStorage(): void {
        const serializedDrawingState = this.getSerializedState()
        saveLocalStorage("drawing", serializedDrawingState)
    }

    async loadFromLocalStorage(): Promise<void> {
        const serializedState = await loadLocalStorage("drawing")
        if (serializedState === null) return
        await this.setSerializedState(serializedState)
    }

    subscribe(subscription: DrawingSubscriber, trigger: RenderTrigger) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(subscription: DrawingSubscriber, trigger: RenderTrigger) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(...subscriptions: DrawingSubscriber[]): void {
        subscriptions.forEach((sub) => {
            this.subscribers[sub].forEach((trigger) => {
                trigger({})
            })
        })

        // Save to local storage on each render
        this.saveToLocalStorage()
    }

    renderAll(): void {
        Object.values(this.subscribers).forEach((triggerList) => {
            triggerList.forEach((trigger) => {
                trigger({})
            })
        })
    }
}

export const drawing = new Drawing()
