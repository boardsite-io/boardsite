import { Image } from "react-konva"
import React, { memo, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import {
    CANVAS_FULL_HEIGHT,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    pageType,
} from "../../constants"
import { pageBackground } from "../../drawing/page"

export default memo(({ pageId }) => {
    const ref = useRef()
    const [update, setUpdate] = useState(0)
    const pageBg = useSelector(
        (state) => state.boardControl.pageCollection[pageId]?.meta?.background
    )
    const docs = useSelector((state) => state.boardControl.docs)
    const pageRank = useSelector((state) => state.boardControl.pageRank)

    // cache the shape on update
    useEffect(() => {
        // dont cache document image
        if (pageBg.style !== pageType.DOC) {
            ref.current.cache({ pixelRatio: 2 })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update])

    // clear the cache and redraw when pagebackground changes
    useEffect(() => {
        ref.current.clearCache()
        // schedule new caching
        setUpdate((prev) => prev + 1)
    }, [pageBg.style])

    return (
        <Image
            ref={ref}
            image={
                pageBg.style === pageType.DOC
                    ? docs[pageBg.pageNum - 1]
                    : undefined
            }
            height={CANVAS_HEIGHT}
            width={CANVAS_WIDTH}
            x={0}
            y={CANVAS_FULL_HEIGHT * pageRank.indexOf(pageId)} // relative
            stroke="#000"
            strokeWidth={0.2}
            fill="#ffffff"
            shadowColor="#000000"
            shadowBlur={10}
            shadowOffset={{ x: 0, y: 0 }}
            shadowOpacity={0.5}
            sceneFunc={
                pageBg.style !== pageType.DOC
                    ? pageBackground[pageBg.style]
                    : null
            }
        />
    )
})
