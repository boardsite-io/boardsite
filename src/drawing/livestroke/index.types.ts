import {
    BaseStroke,
    Point,
    Stroke,
    StrokeMap,
    Tool,
} from "drawing/stroke/index.types"

export interface LiveStroke extends BaseStroke {
    setTool(tool: Tool): LiveStroke
    start({ x, y }: Point, pageId: string): void
    move(point: Point, pagePosition: Point): void
    addPoint(point: Point): void
    finalize(pagePosition: Point): Stroke
    processPoints(pagePosition: Point): void
    reset(): void
    isReset(): boolean
    selectLineCollision(strokes: StrokeMap, pagePosition: Point): StrokeMap
}
