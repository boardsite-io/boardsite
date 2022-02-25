import { MouseEvent, TouchEvent } from "react"
import { TransformStrokes } from "state/board/state/index.types"
import { TrHandle } from "./index.styled"

export type TrBounds = {
    offsetX: number
    offsetY: number
    xMin: number
    xMax: number
    yMin: number
    yMax: number
}

export const getOuterBounds = (
    strokes: TransformStrokes | undefined
): TrBounds => {
    let xMin = 9999
    let yMin = 9999
    let xMax = 0
    let yMax = 0
    // Save stroke width padding for trCanvas render
    let offsetX = 0
    let offsetY = 0

    strokes?.forEach((stroke) => {
        for (let i = 0; i < stroke.points.length; i += 2) {
            const halfStrokeWidth = stroke.style.width / 2
            const xMinContender =
                (stroke.points[i] - halfStrokeWidth + stroke.x) * stroke.scaleX
            if (xMinContender < xMin) {
                xMin = xMinContender
                offsetX = halfStrokeWidth
            }
            const yMinContender =
                (stroke.points[i + 1] - halfStrokeWidth + stroke.y) *
                stroke.scaleY
            if (yMinContender < yMin) {
                yMin = yMinContender
                offsetY = halfStrokeWidth
            }
            const xMaxContender =
                (stroke.points[i] + halfStrokeWidth + stroke.x) * stroke.scaleX
            if (xMaxContender > xMax) {
                xMax = xMaxContender
            }
            const yMaxContender =
                (stroke.points[i + 1] + halfStrokeWidth + stroke.y) *
                stroke.scaleY
            if (yMaxContender > yMax) {
                yMax = yMaxContender
            }
        }
    })

    return { offsetX, offsetY, xMin, xMax, yMin, yMax }
}

export const trHandleFactors = {
    [TrHandle.Top]: { fsx: 0, fsy: -1, fdx: 0, fdy: 1 },
    [TrHandle.TopRight]: { fsx: 1, fsy: -1, fdx: 0, fdy: 1 },
    [TrHandle.Right]: { fsx: 1, fsy: 0, fdx: 0, fdy: 0 },
    [TrHandle.BottomRight]: { fsx: 1, fsy: 1, fdx: 0, fdy: 0 },
    [TrHandle.Bottom]: { fsx: 0, fsy: 1, fdx: 0, fdy: 0 },
    [TrHandle.BottomLeft]: { fsx: -1, fsy: 1, fdx: 1, fdy: 0 },
    [TrHandle.Left]: { fsx: -1, fsy: 0, fdx: 1, fdy: 0 },
    [TrHandle.TopLeft]: { fsx: -1, fsy: -1, fdx: 1, fdy: 1 },
}

export const extractHandle = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
): TrHandle | "clear" | "pan" => {
    const targetId = (e.target as HTMLElement)?.id ?? ""
    const isTrHandler = targetId.includes("tr-handle-")
    const isTrCanvas = targetId.includes("tr-canvas")

    if (!isTrHandler && !isTrCanvas) {
        return "clear"
    }

    if (isTrCanvas) {
        return "pan"
    }

    return targetId.replace("tr-handle-", "") as TrHandle
}
