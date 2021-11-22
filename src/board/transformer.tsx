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
import { useCustomDispatch, useCustomSelector } from "redux/hooks"
import {
    Box,
    Transformer as TransformerType,
} from "konva/lib/shapes/Transformer"
import { Group as GroupType } from "konva/lib/Group"
import store from "redux/store"
import {
    MOVE_SHAPES_TO_DRAG_LAYER,
    UPDATE_DELETE_STROKES,
} from "redux/board/board"
import { TransformStrokes } from "redux/board/board.types"
import { handleUpdateStrokes } from "../drawing/handlers"
import { Point, Stroke } from "../drawing/stroke/types"
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
        const dispatch = useCustomDispatch()

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

        let startPosition: Point | undefined
        const onMouseDown = () => {
            startPosition = transformRef.current?.getPosition()
        }

        const startDragTransform = () => {
            dispatch(UPDATE_DELETE_STROKES({ strokes: transformStrokes }))
        }

        const onDragStart = () => {
            startDragTransform()
        }

        const onTransformStart = () => {
            startDragTransform()
        }

        const onDragEnd = () => {
            const endPosition = transformRef.current?.getPosition()
            if (!startPosition || !endPosition) {
                return
            }

            const { x: stageScaleX, y: stageScaleY } =
                store.getState().board.view.stageScale

            const offset = {
                x: (endPosition.x - startPosition.x) / stageScaleX,
                y: (endPosition.y - startPosition.y) / stageScaleY,
            }

            const updatedStrokes = transformStrokes.map((stroke, i) => {
                const newPosition = {
                    x: stroke.x + offset.x,
                    y: stroke.y + offset.y,
                }
                // transformNodes and transformStrokes array is in same
                // order set internal node attrs to prevent mismatch between
                // rendered strokes and internal transformer nodes
                groupRef.current?.children?.[i]?.setAttrs({ ...newPosition })
                return stroke.update({ ...newPosition })
            })

            store.dispatch(
                MOVE_SHAPES_TO_DRAG_LAYER({ strokes: updatedStrokes })
            )
            // Add transformStrokes back to the contentLayer
            handleUpdateStrokes(...updatedStrokes)
        }

        const onTransformEnd = () => {
            const updatedStrokes = transformStrokes.map((stroke, i) => {
                // transformNodes and transformStrokes are in same order
                const { scaleX, scaleY, x, y } =
                    groupRef.current?.children?.[i]?.getAttrs()
                return stroke.update({ scaleX, scaleY, x, y })
            })

            store.dispatch(
                MOVE_SHAPES_TO_DRAG_LAYER({ strokes: updatedStrokes })
            )
            // Add transformStrokes back to the contentLayer
            handleUpdateStrokes(...updatedStrokes)
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
                    onMouseDown={onMouseDown}
                    onTouchStart={onMouseDown}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onTransformStart={onTransformStart}
                    onTransformEnd={onTransformEnd}
                />
            </>
        )
    }
)

export default StrokeTransformer
