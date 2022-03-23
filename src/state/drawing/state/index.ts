import { StrokeCollection, Tool, ToolType } from "drawing/stroke/index.types"
import { loadLocalStorage, saveLocalStorage } from "storage/local"
import { Paper, PageSize } from "state/board/state/index.types"
import { subscriptionState } from "state/subscription"
import { isDrawType } from "util/drawing"
import { GlobalState, SerializedState } from "../../types"
import { getDefaultDrawingState } from "./default"
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

    /**
     * Set the tool color
     * @param color desired tool color;
     */
    setColor(color: string) {
        this.state.tool.style.color = color
        subscriptionState.render("ActiveTool", "ColorPicker")
    }

    /**
     * Set the tool width
     * @param width tool width;
     */
    setWidth(width: number) {
        this.state.tool.style.width = width
        subscriptionState.render("ActiveTool", "WidthPicker")
    }

    /**
     * Set the strokes which are marked as erased
     * @param strokes the strokes which should be marked as erased
     */
    setErasedStrokes(strokes: StrokeCollection): void {
        Object.keys(strokes).forEach((id) => {
            this.state.erasedStrokes[id] = strokes[id]
        })
        subscriptionState.render("PageContent")
    }

    /**
     * Clear the strokes which were marked as erased after their actual erasure
     */
    clearErasedStrokes(): void {
        this.state.erasedStrokes = {}
    }

    /**
     * Change the paper setting which will be used when adding new pages
     * @param paper paper style setting
     */
    setPageBackground(paper: Paper) {
        this.state.pageMeta.background.paper = paper
        subscriptionState.render("PageStyleMenu", "PageBackgroundSetting")
        this.saveToLocalStorage()
    }

    /**
     * Change the page size setting which will be used when adding new pages
     * @param size page size setting;
     */
    setPageSize(size: PageSize) {
        this.state.pageMeta.size = size
        subscriptionState.render("PageSizeMenu", "PageSizeSetting")
        this.saveToLocalStorage()
    }

    /**
     * Change the current tool
     * @param tool the tool to be used
     */
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

    /**
     * Add a new favorite tool to the quick menu
     */
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

    /**
     * Remove a favorite tool from the quick menu
     * @param index position of element to be removed
     */
    removeFavoriteTool(index: number) {
        this.state.favoriteTools.splice(index, 1)
        subscriptionState.render("FavoriteTools")
        this.saveToLocalStorage()
    }

    /**
     * Replace a favorite tool in the quick menu
     * @param index position of element to be replaced
     */
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
        const state = this.getState()
        saveLocalStorage("drawing", () => serializeDrawingState(state))
    }

    async loadFromLocalStorage(): Promise<void> {
        const serializedState = await loadLocalStorage("drawing")
        if (serializedState === null) return
        await this.setSerializedState(serializedState)
    }
}

export const drawing = new Drawing()
