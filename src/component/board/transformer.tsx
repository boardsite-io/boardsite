import React, { useRef } from "react"
import { Transformer } from "react-konva"
import { Box } from "konva/types/shapes/Transformer"
import { Node, NodeConfig } from "konva/types/Node"
import { createSelector } from "reselect"
import { Stroke, ToolType, TrNodesType, TrRefType } from "../../types"
import {
    TR_BORDER_STROKE,
    TR_BORDER_STROKE_WIDTH,
    TR_ANCHOR_FILL,
    TR_ANCHOR_STROKE,
    TR_ANCHOR_SIZE,
    TR_ANCHOR_CORNER_RADIUS,
} from "../../constants"
import { useCustomSelector } from "../../redux/hooks"
import { handleUpdateStrokes } from "../../drawing/handlers"
import store, { RootState } from "../../redux/store"

const StrokeTransformer = (): JSX.Element => {
    const trRef: TrRefType = useRef(null)

    // unselect transformer selection when change tool
    const trSelector = createSelector(
        (state: RootState) => state.drawControl.trNodes,
        (trNodes: TrNodesType) => {
            if (trNodes !== undefined) {
                trRef.current?.nodes(trNodes)
            }
        }
    )
    useCustomSelector(trSelector)

    const boundBoxFunc = (oldBox: Box, newBox: Box) => {
        // limit resize
        if (newBox.width < 5 || newBox.height < 5) {
            return oldBox
        }
        return newBox
    }

    const updateSelectedStrokes = () => {
        const strokerefs = store.getState().drawControl.trNodes
        const strokes = strokerefs.map(
            (stroke: Node<NodeConfig>) =>
                ({
                    id: stroke.attrs.id,
                    pageId: stroke.attrs.name, // we use name as pageid
                    scaleX: stroke.attrs.scaleX,
                    scaleY: stroke.attrs.scaleY,
                    x: stroke.attrs.x,
                    y: stroke.attrs.y,
                } as Stroke)
        )

        handleUpdateStrokes(strokes)
    }

    const onDragEnd = () => {
        if (store.getState().drawControl.liveStroke.type !== ToolType.Eraser) {
            updateSelectedStrokes()
        }
    }

    const onTransformEnd = () => {
        updateSelectedStrokes()
    }

    return (
        <Transformer
            shouldOverdrawWholeArea
            borderStroke={TR_BORDER_STROKE}
            borderStrokeWidth={TR_BORDER_STROKE_WIDTH}
            borderEnabled
            // borderDash={[5, 5]}
            anchorFill={TR_ANCHOR_FILL}
            anchorSize={TR_ANCHOR_SIZE}
            anchorStroke={TR_ANCHOR_STROKE}
            anchorCornerRadius={TR_ANCHOR_CORNER_RADIUS}
            rotateEnabled={false}
            ref={trRef}
            boundBoxFunc={boundBoxFunc}
            onDragEnd={onDragEnd}
            onTransformEnd={onTransformEnd}
        />
    )
}

export default StrokeTransformer