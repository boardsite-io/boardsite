import React, { useRef } from "react"
import { Transformer } from "react-konva"
import { Box } from "konva/types/shapes/Transformer"
import { createSelector } from "reselect"
import { RootState } from "../../redux/store"
import { TrNodesType, TrRefType } from "../../types"
import {
    TR_BORDER_STROKE,
    TR_BORDER_STROKE_WIDTH,
    TR_ANCHOR_FILL,
    TR_ANCHOR_STROKE,
    TR_ANCHOR_SIZE,
    TR_ANCHOR_CORNER_RADIUS,
} from "../../constants"
import { useCustomSelector } from "../../redux/hooks"

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
        />
    )
}

export default StrokeTransformer
