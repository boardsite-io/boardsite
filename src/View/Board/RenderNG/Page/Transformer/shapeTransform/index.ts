import { Point } from "drawing/stroke/index.types"
import { cloneDeep } from "lodash"
import { TransformStrokes } from "redux/board/index.types"
import { calcScaleDelta, trHandleFactors, TrBounds } from "../helpers"
import { TrHandle } from "../index.styled"
import { TransformState } from "./index.types"

export class ShapeTransformer {
    trState: TransformState = {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
    }

    setTrState(newState: TransformState): void {
        if (this.trState === newState) return
        this.trState = newState
    }

    startTr() {
        this.trState = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
        }
    }

    updateTrPosition(trDiv: HTMLDivElement | null, delta: Point): void {
        this.trState.x += delta.x
        this.trState.y += delta.y
        this.applyTr(trDiv)
    }

    updateTrScale(
        trDiv: HTMLDivElement | null,
        delta: Point,
        bounds: TrBounds,
        handleType: TrHandle
    ): void {
        const { xScale, yScale } = calcScaleDelta(delta, bounds)
        const { fsx, fsy, fdx, fdy } = trHandleFactors[handleType]

        this.trState.x += fdx * delta.x
        this.trState.y += fdy * delta.y

        this.trState.scaleX += fsx * xScale
        this.trState.scaleY += fsy * yScale

        this.applyTr(trDiv)
    }

    endTr(
        trDiv: HTMLDivElement | null,
        trStrokes: TransformStrokes,
        bounds: TrBounds
    ): TransformStrokes {
        const updatedStrokes = cloneDeep(trStrokes).map((stroke) => {
            const tr = this.trState
            // Transform selection transform to page transform
            const pageTr: TransformState = {
                x: (tr.x - (tr.scaleX - 1) * bounds.xMin) / tr.scaleX,
                y: (tr.y - (tr.scaleY - 1) * bounds.yMin) / tr.scaleY,
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

    resetTr(trDiv: HTMLDivElement | null): void {
        if (!trDiv) return
        const { childNodes } = trDiv

        for (let i = 1; i < childNodes.length; i++) {
            const handle = childNodes[i] as HTMLDivElement
            handle.style.transform = `translate(-50%, -50%) scale(1,1)`
        }

        trDiv.style.transform = `translate(0,0) scale(1,1)`

        this.trState = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
        }
    }
}

export const shapeTr = new ShapeTransformer()
