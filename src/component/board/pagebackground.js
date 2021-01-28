import React, { memo } from "react"
import { Rect } from "react-konva"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../constants"
import store from "../../redux/store"

export default memo(({ pageId }) => (
    <Rect
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        x={0}
        y={
            (CANVAS_HEIGHT + 20) *
            store.getState().boardControl.present.pageRank.indexOf(pageId)
        }
        stroke="#000"
        strokeWidth={0.2}
        fill="#eee"
        shadowColor="#000000"
        shadowBlur={5}
        shadowOffset={{ x: 5, y: 5 }}
        shadowOpacity={0.5}
    />
))
