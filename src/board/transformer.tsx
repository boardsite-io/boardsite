import React, { memo, useCallback, useRef } from "react"
import { Group, Transformer } from "react-konva"
import {
    TR_BORDER_STROKE,
    TR_BORDER_STROKE_WIDTH,
    TR_ANCHOR_FILL,
    TR_ANCHOR_STROKE,
    TR_ANCHOR_SIZE,
    TR_ANCHOR_CORNER_RADIUS,
} from "consts"
import { useCustomSelector } from "hooks"
import {
    Box,
    Transformer as TransformerType,
} from "konva/lib/shapes/Transformer"
import { Group as GroupType } from "konva/lib/Group"
import store from "redux/store"
import { TransformStrokes } from "redux/board/board.types"
import { handleDeleteStrokes, handleUpdateStrokes } from "../drawing/handlers"
import { Stroke } from "../drawing/stroke/types"
import { StrokeShape } from "./stroke/strokeShape"

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

        /**
         * Insert the group nodes into the transformer
         */
        React.useEffect(() => {
            const selectedNodes = groupRef.current?.children
            if (selectedNodes) {
                transformRef.current?.nodes(selectedNodes)
            }
        }, [transformStrokes])

        /**
         * Customise the resizing limits
         */
        const boundBoxFunc = useCallback(
            (oldBox: Box, newBox: Box) =>
                newBox.width < 5 || newBox.height < 5 ? oldBox : newBox,
            []
        )

        /**
         * Start of dragging or scaling transform event
         */
        const onStart = useCallback(() => {
            // Remove transformStrokes from the contentLayer
            handleDeleteStrokes(...transformStrokes)
        }, [transformStrokes])

        /**
         * End of dragging or scaling transform event
         */
        const onEnd = useCallback(() => {
            // Update stroke attributes using the internal konva states of the nodes
            const updatedStrokes = transformStrokes.map((stroke, i) => {
                const newAttrs = groupRef.current?.children?.[i]?.getAttrs()

                return newAttrs ? stroke.update(newAttrs) : stroke
            })

            // Add transformStrokes back to the contentLayer
            handleUpdateStrokes(...updatedStrokes)
        }, [transformStrokes])

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
                    onMouseDown={onStart}
                    onTouchStart={onStart}
                    onDragEnd={onEnd}
                    onTransformEnd={onEnd}
                />
            </>
        )
    }
)

export default StrokeTransformer
