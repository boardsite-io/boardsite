import { Image } from "react-konva"
import React, { memo, useEffect, useRef, useState } from "react"
import * as types from "konva/types/shapes/Image"
import { DOC_SCALE, pageType } from "../../constants"
import { loadNewPDF, pageBackground } from "../../drawing/page"
import { useCustomSelector } from "../../redux/hooks"
import { PageProps } from "./types"

export default memo<PageProps>(({ pageId, pageSize }) => {
    const ref = useRef<types.Image>(null)
    const [update, setUpdate] = useState(0)
    const { document } = useCustomSelector((state) => state.boardControl)
    const { background } = useCustomSelector(
        (state) => state.boardControl.pageCollection[pageId].meta
    )
    // select style, selecting background doesnt trigger, bc it compares on the same reference
    const { style } = useCustomSelector(
        (state) => state.boardControl.pageCollection[pageId].meta.background
    )

    // get correct image data for document type background
    const getImage = () => {
        if (style !== pageType.DOC) {
            return undefined
        }
        const img = document[background.documentPageNum]
        // if image data not available, load document
        if (!img) {
            loadNewPDF(background.attachId).then(() =>
                setUpdate((prev) => prev + 1)
            )
        }
        return img
    }

    // cache the shape on update
    useEffect(() => {
        ref.current?.cache({ pixelRatio: DOC_SCALE })
    }, [update])

    // clear the cache and redraw when pagebackground changes
    useEffect(() => {
        ref.current?.clearCache()
        // schedule new caching
        setUpdate((prev) => prev + 1)
    }, [style])

    return (
        <Image
            {...pageSize}
            ref={ref}
            image={getImage()}
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
