import { StrokeCollection, Tool, ToolType } from "drawing/stroke/index.types"
import { loadLocalStorage, saveLocalStorage } from "storage/local"
import { Paper, PageSize } from "state/board/state/index.types"
import { subscriptionState } from "state/subscription"
import { GlobalState, SerializedState } from "../../types"
import { getDefaultDrawingState } from "./default"
import { isDrawType } from "../util"
import { DrawingState } from "./index.types"
import { deserializeDrawingState, serializeDrawingState } from "../serializers"

export class Drawing implements GlobalState<DrawingState> {
    state: DrawingState = getDefaultDrawingState()

    getState(): DrawingState {
        return this.state
    }

    setState(newState: DrawingState): void {
        this.state = newState
        subscriptionState.render(
            "FavoriteTools",
            "ActiveTool",
            "WidthPicker",
            "ColorPicker"
        )
        this.saveToLocalStorage()
    }

    setColor(color: string) {
        this.state.tool.style.color = color
        subscriptionState.render("ActiveTool", "ColorPicker")
    }

    setWidth(width: number) {
        this.state.tool.style.width = width
        subscriptionState.render("ActiveTool", "WidthPicker")
    }

    setErasedStrokes(strokes: StrokeCollection): void {
        Object.keys(strokes).forEach((id) => {
            this.state.erasedStrokes[id] = strokes[id]
        })
        subscriptionState.render("PageContent")
    }

    clearErasedStrokes(): void {
        this.state.erasedStrokes = {}
    }

    setPageBackground(style: Paper) {
        this.state.pageMeta.background.style = style
        subscriptionState.render("PageStyleMenu", "PageBackgroundSetting")
        this.saveToLocalStorage()
    }

    setPageSize(size: PageSize) {
        this.state.pageMeta.size = size
        subscriptionState.render("PageSizeMenu", "PageSizeSetting")
        this.saveToLocalStorage()
    }

    setTool(tool: Partial<Tool>): void {
        if (tool.type !== undefined) {
            this.state.tool.type = tool.type

            // Save latest draw type to enable resuming to that tool
            if (isDrawType(tool.type)) {
                this.state.tool.latestDrawType = tool.type
            }

            subscriptionState.render(
                "ActiveTool",
                "ToolRing",
                "ShapeTools",
                "UseViewControl",
                "UseLiveStroke"
            )
        }
        if (tool.style !== undefined) {
            this.state.tool.style = { ...tool.style }

            subscriptionState.render("ActiveTool", "WidthPicker", "ColorPicker")
        }
    }

    addFavoriteTool() {
        const tool: Tool = {
            type: this.state.tool.type,
            style: { ...this.state.tool.style },
        }

        if (isDrawType(tool.type)) {
            this.state.favoriteTools.push(tool)
            subscriptionState.render("FavoriteTools")
            this.saveToLocalStorage()
        }
    }

    removeFavoriteTool(index: number) {
        this.state.favoriteTools.splice(index, 1)
        subscriptionState.render("FavoriteTools")
        this.saveToLocalStorage()
    }

    replaceFavoriteTool(index: number): void {
        const tool: Tool = {
            type: this.state.tool.type,
            style: { ...this.state.tool.style },
        }

        // validate tool candidate
        if (tool.type !== ToolType.Eraser && tool.type !== ToolType.Select) {
            this.state.favoriteTools[index] = tool
            subscriptionState.render("FavoriteTools")
            this.saveToLocalStorage()
        }
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
}

export const drawing = new Drawing()
