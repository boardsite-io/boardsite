import { useViewControl } from "hooks"
import React from "react"
import { useGState } from "state"
import { Content, ViewControl, ViewBackground } from "./index.styled"

type ViewTransformerProps = { children: React.ReactNode }

const Observer: React.FC<ViewTransformerProps> = ({ children }) => {
    const {
        isPanMode,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onTouchCancel,
        onWheel,
        onScroll,
    } = useViewControl()

    const { scale, xOffset, yOffset } =
        useGState("ViewTransform").view.viewTransform

    return (
        <ViewBackground
            onMouseDown={isPanMode ? onMouseDown : undefined}
            onMouseMove={isPanMode ? onMouseMove : undefined}
            onMouseUp={isPanMode ? onMouseUp : undefined}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
            onWheel={onWheel}
            onScroll={onScroll}
        >
            <ViewControl
                style={{
                    zoom: scale,
                    left: xOffset,
                    top: yOffset,
                }}
            >
                <Content>{children}</Content>
            </ViewControl>
        </ViewBackground>
    )
}

export default Observer
