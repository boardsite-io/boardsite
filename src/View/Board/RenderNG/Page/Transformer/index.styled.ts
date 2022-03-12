import styled, { css, FlattenSimpleInterpolation } from "styled-components"
import { Canvas } from "../index.styled"

export const TrWrap = styled.div`
    position: absolute;
    inset: 0;
`

export const SelectionTransformer = styled.div`
    transform-origin: top left;
    position: relative;
    height: fit-content;
    width: fit-content;
`

export const TrCanvas = styled(Canvas)`
    cursor: move;
    position: relative;
    background: var(--sel-color);
`

export const TrCanvasHandle = styled.div<{ position: TrHandle }>`
    position: absolute;
    width: var(--sel-handle-size);
    height: var(--sel-handle-size);
    background: var(--sel-handle-color);
    border: 1px solid;
    border-color: ${({ theme }) => theme.palette.secondary.main};
    border-radius: var(--sel-handle-border-radius);

    transform-origin: center;
    transform: translate(-50%, -50%);
    ${({ position }) => handlePosition[position]}
`

export enum TrHandle {
    TopLeft = "topleft",
    Top = "top",
    TopRight = "topright",
    Right = "right",
    BottomRight = "bottomright",
    Bottom = "bottom",
    BottomLeft = "bottomleft",
    Left = "left",
}

const handlePosition: Record<TrHandle, FlattenSimpleInterpolation> = {
    [TrHandle.TopLeft]: css`
        cursor: nwse-resize;
        top: 0;
        left: 0;
    `,
    [TrHandle.Top]: css`
        cursor: ns-resize;
        left: 50%;
        top: 0;
    `,
    [TrHandle.TopRight]: css`
        cursor: nesw-resize;
        left: 100%;
        top: 0;
    `,
    [TrHandle.Right]: css`
        cursor: ew-resize;
        left: 100%;
        top: 50%;
    `,
    [TrHandle.BottomRight]: css`
        cursor: nwse-resize;
        left: 100%;
        top: 100%;
    `,
    [TrHandle.Bottom]: css`
        cursor: ns-resize;
        top: 100%;
        left: 50%;
    `,
    [TrHandle.BottomLeft]: css`
        cursor: nesw-resize;
        top: 100%;
        left: 0;
    `,
    [TrHandle.Left]: css`
        cursor: ew-resize;
        top: 50%;
        left: 0;
    `,
}
