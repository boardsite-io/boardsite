import { Image } from "react-konva"
import React, { memo, useEffect, useRef, useState } from "react"
import {
    CANVAS_FULL_HEIGHT,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    pageType,
} from "../../constants"
import { pageBackground } from "../../drawing/page"
import { useCustomSelector } from "../../redux/hooks"
import store from "../../redux/store"

interface PageBackgroundProps {
    pageId: string
}

export default memo<PageBackgroundProps>(({ pageId }) => {
    const ref = useRef<any>()
    const [update, setUpdate] = useState(0)
    // select style, selecting background doesnt trigger, bc it compares on the same reference
    const style = useCustomSelector(
        (state) =>
            state.boardControl.pageCollection[pageId]?.meta?.background.style
    )
    const docs = useCustomSelector((state) => state.boardControl.docs)
    const pageRank = useCustomSelector((state) => state.boardControl.pageRank)

    const { pageNum } = store.getState().boardControl.pageCollection[
        pageId
    ]?.meta?.background

    // cache the shape on update
    useEffect(() => {
        // dont cache document image
        if (style !== pageType.DOC) {
            ref.current.cache({ pixelRatio: 2 })
        }
    }, [update])

    // clear the cache and redraw when pagebackground changes
    useEffect(() => {
        ref.current.clearCache()
        // schedule new caching
        setUpdate((prev) => prev + 1)
    }, [style])

    return (
        <Image
            ref={ref}
            image={style === pageType.DOC ? docs[pageNum - 1] : undefined}
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
                style !== pageType.DOC ? pageBackground[style] : undefined
            }
        />
    )
})
