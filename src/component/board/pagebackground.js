import { Rect } from "react-konva"
import React, { memo, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import {
    CANVAS_FULL_HEIGHT,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
} from "../../constants"
import { getPageIndex } from "../../drawing/strokeactions"
import { pageBackground } from "../../drawing/page"

export default memo(({ pageId }) => {
    const ref = useRef()
    const [update, setUpdate] = useState(0)
    const pageBg = useSelector(
        (state) =>
            state.boardControl.pageCollection[pageId]?.meta?.background.style
    )

    // cache the shape on update
    useEffect(() => {
        ref.current.cache({ pixelRatio: 2 })
    }, [update])

    // clear the cache and redraw when pagebackground changes
    useEffect(() => {
        ref.current.clearCache()
        // schedule new caching
        setUpdate((prev) => prev + 1)
    }, [pageBg])

    return (
        <Rect
            ref={ref}
            height={CANVAS_HEIGHT}
            width={CANVAS_WIDTH}
            x={0}
            y={CANVAS_FULL_HEIGHT * getPageIndex(pageId)}
            stroke="#000"
            strokeWidth={0.2}
            fill="#ffffff"
            shadowColor="#000000"
            shadowBlur={10}
            shadowOffset={{ x: 0, y: 0 }}
            shadowOpacity={0.5}
            sceneFunc={pageBackground[pageBg]}
        />
    )
})
