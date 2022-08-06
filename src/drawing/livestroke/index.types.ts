import {
    SerializedStroke,
    Point,
    Stroke,
    StrokeCollection,
    Tool,
} from "drawing/stroke/index.types"

export interface LiveStroke extends SerializedStroke {
    start(point: Point, pageId: string): void
    move(point: Point, pagePosition: Point): void
    end(point: Point): void
    setTool(tool: Tool): void
    addPoint(point: Point): void
    processPoints(): void
    reset(): void
    moveEraser(): void
    isReset(): boolean
    selectLineCollision(strokes: StrokeCollection): Stroke[]
}
