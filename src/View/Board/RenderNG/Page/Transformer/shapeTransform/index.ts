import { Point } from "drawing/stroke/index.types"
import { cloneDeep } from "lodash"
import { TransformStrokes } from "state/board/state/index.types"
import { trHandleFactors, TrBounds } from "../helpers"
import { TrHandle } from "../index.styled"
import { TransformState } from "./index.types"

export class ShapeTransformer {
    trState: TransformState = {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
    }

    firstPoint: Point = { x: 0, y: 0 }

    bounds: TrBounds = {
        offsetX: 0,
        offsetY: 0,
        xMin: 0,
        xMax: 0,
        yMin: 0,
        yMax: 0,
    }

    start(point: Point, trHandle: TrHandle | "pan") {
        if (trHandle === "pan") {
            this.firstPoint = point
        } else {
            this.setFirstPointHandle(trHandle)
        }
        this.resetTrState()
    }

    move(
        point: Point,
        trHandle: TrHandle | "pan",
        trDiv: HTMLDivElement | null
    ): void {
        const delta = this.getPointDelta(point)

        if (trHandle === "pan") {
            this.pan(delta)
        } else {
            this.scale(delta, trHandle)
        }
        this.applyTr(trDiv)
    }

    end(
        trDiv: HTMLDivElement | null,
        trStrokes: TransformStrokes
    ): TransformStrokes {
        const updatedStrokes = cloneDeep(trStrokes).map((stroke) => {
            const tr = this.trState
            // Transform selection transform to page transform
            const pageTr: TransformState = {
                x: (tr.x - (tr.scaleX - 1) * this.bounds.xMin) / tr.scaleX,
                y: (tr.y - (tr.scaleY - 1) * this.bounds.yMin) / tr.scaleY,
                scaleX: tr.scaleX,
                scaleY: tr.scaleY,
            }

            // Apply page transform to previous page transform of shape
            const newTr: TransformState = {
                x: stroke.x + pageTr.x / stroke.scaleX,
                y: stroke.y + pageTr.y / stroke.scaleY,
                scaleX: (stroke.scaleX ?? 1) * tr.scaleX,
                scaleY: (stroke.scaleY ?? 1) * tr.scaleY,
            }

            stroke.update(newTr)
            return stroke
        })

        this.resetTr(trDiv)
        return updatedStrokes
    }

    applyTr(trDiv: HTMLDivElement | null) {
        if (!trDiv) return
        const { x, y, scaleX, scaleY } = this.trState
        const { childNodes } = trDiv

        for (let i = 1; i < childNodes.length; i++) {
            const handle = childNodes[i] as HTMLDivElement
            handle.style.transform = `translate(-50%, -50%) scale(${
                1 / scaleX
            }, ${1 / scaleY})`
        }

        trDiv.style.transform = `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`
    }

    setBounds(bounds: TrBounds): void {
        this.bounds = bounds
    }

    setTrState(newState: TransformState): void {
        if (this.trState === newState) return
        this.trState = newState
    }

    resetTrState(): void {
        this.trState = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
        }
    }

    resetTr(trDiv: HTMLDivElement | null): void {
        if (!trDiv) return
        const { childNodes } = trDiv

        for (let i = 1; i < childNodes.length; i++) {
            const handle = childNodes[i] as HTMLDivElement
            handle.style.transform = `translate(-50%, -50%) scale(1,1)`
        }

        trDiv.style.transform = `translate(0,0) scale(1,1)`

        this.resetTrState()
    }

    pan(delta: Point): void {
        this.trState.x = delta.x
        this.trState.y = delta.y
    }

    scale(delta: Point, trHandle: TrHandle): void {
        const scaleDelta = this.getScaleDelta(delta)
        const { fsx, fsy, fdx, fdy } = trHandleFactors[trHandle]
        const trWidth = this.bounds.xMax - this.bounds.xMin
        const trHeight = this.bounds.yMax - this.bounds.yMin

        if (
            trHandle === TrHandle.BottomRight ||
            trHandle === TrHandle.BottomLeft ||
            trHandle === TrHandle.TopLeft ||
            trHandle === TrHandle.TopRight
        ) {
            if (trHeight > trWidth) {
                this.trState.scaleX = 1 + fsx * scaleDelta.x
                this.trState.scaleY = 1 + fsx * scaleDelta.x
            } else {
                this.trState.scaleX = 1 + fsy * scaleDelta.y
                this.trState.scaleY = 1 + fsy * scaleDelta.y
            }

            if (trHandle === TrHandle.BottomRight) {
                if (trHeight > trWidth) {
                    this.trState.x = fdx * delta.x
                    this.trState.y = fdy * delta.x
                } else {
                    this.trState.x = fdx * delta.y
                    this.trState.y = fdy * delta.y
                }
            } else if (trHandle === TrHandle.TopLeft) {
                if (trHeight > trWidth) {
                    this.trState.x = delta.x
                    this.trState.y = (trHeight / trWidth) * delta.x
                } else {
                    this.trState.x = (trWidth / trHeight) * delta.y
                    this.trState.y = delta.y
                }
            } else if (trHandle === TrHandle.BottomLeft) {
                if (trHeight > trWidth) {
                    this.trState.x = fdx * delta.x
                } else {
                    this.trState.x = -(trWidth / trHeight) * delta.y
                }
                this.trState.y = 0
            } else if (trHandle === TrHandle.TopRight) {
                if (trHeight > trWidth) {
                    this.trState.x = fdx * delta.x
                    this.trState.y = (-trHeight / trWidth) * delta.x
                } else {
                    this.trState.x = fdx * delta.y
                    this.trState.y = fdy * delta.y
                }
            }
        } else {
            this.trState.scaleX = 1 + fsx * scaleDelta.x
            this.trState.scaleY = 1 + fsy * scaleDelta.y
            this.trState.x = fdx * delta.x
            this.trState.y = fdy * delta.y
        }
    }

    getBoundCenterX(): number {
        return this.bounds.xMax - (this.bounds.xMax - this.bounds.xMin) / 2
    }

    getBoundCenterY(): number {
        return this.bounds.yMax - (this.bounds.yMax - this.bounds.yMin) / 2
    }

    setFirstPointHandle(trHandle: TrHandle) {
        switch (trHandle) {
            case TrHandle.TopLeft:
                this.firstPoint = {
                    x: this.bounds.xMin,
                    y: this.bounds.yMin,
                }
                break
            case TrHandle.TopRight:
                this.firstPoint = {
                    x: this.bounds.xMax,
                    y: this.bounds.yMin,
                }
                break
            case TrHandle.BottomRight:
                this.firstPoint = {
                    x: this.bounds.xMax,
                    y: this.bounds.yMax,
                }
                break
            case TrHandle.BottomLeft:
                this.firstPoint = {
                    x: this.bounds.xMin,
                    y: this.bounds.yMax,
                }
                break
            case TrHandle.Top:
                this.firstPoint = {
                    x: this.getBoundCenterX(),
                    y: this.bounds.yMin,
                }
                break
            case TrHandle.Right:
                this.firstPoint = {
                    x: this.bounds.xMax,
                    y: this.getBoundCenterY(),
                }
                break
            case TrHandle.Bottom:
                this.firstPoint = {
                    x: this.getBoundCenterX(),
                    y: this.bounds.yMax,
                }
                break
            case TrHandle.Left:
            default:
                this.firstPoint = {
                    x: this.bounds.xMin,
                    y: this.getBoundCenterY(),
                }
                break
        }
    }

    getPointDelta(point: Point): Point {
        return {
            x: point.x - this.firstPoint.x,
            y: point.y - this.firstPoint.y,
        }
    }

    getScaleDelta(delta: Point): Point {
        return {
            x: delta.x / (this.bounds.xMax - this.bounds.xMin),
            y: delta.y / (this.bounds.yMax - this.bounds.yMin),
        }
    }
}

export const shapeTr = new ShapeTransformer()
