import React, { memo, useRef } from "react"
import { Group, Transformer } from "react-konva"
import {
    TR_BORDER_STROKE,
    TR_BORDER_STROKE_WIDTH,
    TR_ANCHOR_FILL,
    TR_ANCHOR_STROKE,
    TR_ANCHOR_SIZE,
    TR_ANCHOR_CORNER_RADIUS,
} from "consts"
import { useCustomSelector } from "redux/hooks"
import {
    Box,
    Transformer as TransformerType,
} from "konva/lib/shapes/Transformer"
import { Group as GroupType } from "konva/lib/Group"
import store from "redux/store"
import { TransformStrokes } from "types"
import { KonvaEventObject } from "konva/lib/Node"
import { handleAddStrokes, handleDeleteStrokes } from "../drawing/handlers"
import { Point, Scale, Stroke } from "../drawing/stroke/types"
import { StrokeShape } from "./stroke/shape"

const StrokeTransformer = memo(() => {
    const transformStrokes = useCustomSelector(
        (state) => state.board.transformStrokes
    )
    return <CustomTransformer transformStrokes={transformStrokes} />
})

interface CustomTransformerProps {
    transformStrokes: TransformStrokes | undefined
}
const CustomTransformer = memo<CustomTransformerProps>(
    ({ transformStrokes }) => {
        const { transformPagePosition } = store.getState().board
        if (!transformStrokes || !transformPagePosition) {
            return null
        }
        const transformRef: React.RefObject<TransformerType> = useRef(null)
        const groupRef: React.RefObject<GroupType> = useRef(null)

        React.useEffect(() => {
            const selectedNodes = groupRef.current?.children
            if (selectedNodes) {
                transformRef.current?.nodes(selectedNodes)
            }
        }, [transformStrokes])

        const boundBoxFunc = (oldBox: Box, newBox: Box) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
                return oldBox
            }
            return newBox
        }

        const getPosition = (e: KonvaEventObject<DragEvent>) => ({
            x: e.target.x() ?? 0,
            y: e.target.y() ?? 0,
        })

        let dragStartPosition: Point
        const onDragStart = (e: KonvaEventObject<DragEvent>) => {
            console.log("drag start")
            dragStartPosition = getPosition(e)
            handleDeleteStrokes(...transformStrokes)
        }

        const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
            console.log("drag end")
            const dragEndPosition = getPosition(e)
            const offset = {
                x: dragEndPosition.x - dragStartPosition.x,
                y: dragEndPosition.y - dragStartPosition.y,
            }

            const updatedStrokes = transformStrokes.map((stroke) => {
                const newScale: Scale = { x: 1, y: 1 } // TODO scale
                const newPosition = {
                    x: stroke.x + offset.x,
                    y: stroke.y + offset.y,
                }
                stroke.update(newPosition, newScale)
                return stroke
            })

            handleAddStrokes(...updatedStrokes)
        }

        const onTransformEnd = () => {
            // updateSelectedStrokes()
        }

        return (
            <>
                <Group
                    ref={groupRef}
                    x={transformPagePosition.x}
                    y={transformPagePosition.y}>
                    {transformStrokes.map((stroke: Stroke) => (
                        <StrokeShape key={stroke.id} stroke={stroke} />
                    ))}
                </Group>
                <Transformer
                    ref={transformRef}
                    shouldOverdrawWholeArea
                    borderStroke={TR_BORDER_STROKE}
                    borderStrokeWidth={TR_BORDER_STROKE_WIDTH}
                    borderEnabled
                    borderDash={[5, 5]}
                    anchorFill={TR_ANCHOR_FILL}
                    anchorSize={TR_ANCHOR_SIZE}
                    anchorStroke={TR_ANCHOR_STROKE}
                    anchorCornerRadius={TR_ANCHOR_CORNER_RADIUS}
                    rotateEnabled={false}
                    boundBoxFunc={boundBoxFunc}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onTransformEnd={onTransformEnd}
                />
            </>
        )
    }
)

export default StrokeTransformer
