import React from "react"
import { Circle, Ellipse, Line, Rect } from "react-konva"
import {
    ERASER_WIDTH,
    SEL_FILL,
    SEL_FILL_ENABLED,
    SEL_STROKE,
    SEL_STROKE_ENABLED,
} from "consts"
import { Point, Stroke, ToolType } from "drawing/stroke/types"
import { LineConfig } from "konva/lib/shapes/Line"
import { LiveStroke } from "drawing/livestroke/livestroke.types"

interface StrokeShapeProps {
    stroke: Stroke | LiveStroke
}

type CustomLineConfig = LineConfig & { points: number[] }

interface StrokeShapeProps {
    stroke: Stroke | LiveStroke
    shapeProps: CustomLineConfig
}

// Use LineConfig since it requires points prop
export const Shape = ({
    stroke,
    shapeProps,
}: StrokeShapeProps): JSX.Element => {
    switch (stroke.type) {
        case ToolType.Eraser: {
            shapeProps.strokeWidth = ERASER_WIDTH
            shapeProps.stroke = "#fff"
            return <Line tension={0.35} {...shapeProps} />
        }
        case ToolType.Pen: {
            return <Line tension={0.35} {...shapeProps} />
        }
        case ToolType.Line:
            return <Line {...shapeProps} />
        case ToolType.Circle:
            return (
                <Ellipse
                    {...shapeProps}
                    radiusX={Math.abs(
                        (shapeProps.points[2] - shapeProps.points[0]) / 2
                    )}
                    radiusY={Math.abs(
                        (shapeProps.points[3] - shapeProps.points[1]) / 2
                    )}
                    fillEnabled={false} // Remove inner hitbox from empty circles
                />
            )
        case ToolType.Rectangle:
            return (
                <Rect
                    {...shapeProps}
                    width={shapeProps.points[2] - shapeProps.points[0]}
                    height={shapeProps.points[3] - shapeProps.points[1]}
                    fillEnabled
                />
            )
        case ToolType.Select:
            return (
                <Rect
                    {...shapeProps}
                    width={shapeProps.points[2] - shapeProps.points[0]}
                    height={shapeProps.points[3] - shapeProps.points[1]}
                    stroke={SEL_STROKE}
                    strokeEnabled={SEL_STROKE_ENABLED}
                    fill={SEL_FILL}
                    fillEnabled={SEL_FILL_ENABLED}
                />
            )
        default:
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <></>
    }
}

/**
 * Function to draw circles at stroke points.
 */
export function debugStrokePoints(
    points: number[],
    width: number
): JSX.Element {
    const pts: Point[] = []
    for (let i = 0; i < points.length; i += 2) {
        pts.push({ x: points[i], y: points[i + 1] })
    }
    return (
        <>
            {pts.map((pt, i) => (
                <Circle
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    x={pt.x}
                    y={pt.y}
                    radius={width / 2}
                    fill="#00ff00"
                    strokeWidth={0}
                />
            ))}
        </>
    )
}
