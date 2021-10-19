import { Image, Rect } from "react-konva"
import React, { memo, useEffect, useRef, useState } from "react"
import * as types from "konva/types/shapes/Image"
import * as rectTypes from "konva/types/shapes/Rect"
import { DOC_SCALE, pageType } from "consts"
import { loadNewPDF, pageBackground } from "drawing/page"
import { useCustomSelector } from "redux/hooks"
import store from "redux/store"
import { PageProps } from "./types"

const PageBoundary: React.FC<PageProps> = ({ pageSize }) => {
    const ref = useRef<rectTypes.Rect>(null)

    useEffect(() => {
        ref.current?.cache()
    }, [])

    return (
        <Rect
            {...pageSize}
            ref={ref}
            stroke="#000"
            strokeWidth={0.2}
            fill="#ffffff"
            shadowColor="#000000"
            shadowBlur={10}
            shadowOffset={{ x: 0, y: 0 }}
            shadowOpacity={0.5}
        />
    )
}

export default memo<PageProps>(({ pageId, pageSize }) => {
    // pageId might not be valid anymore, exit then
    if (!store.getState().board.pageCollection[pageId]) {
        return null
    }

    const ref = useRef<types.Image>(null)
    const [cache, triggerCache] = useState(0)
    const [img, setImg] = useState<HTMLImageElement>()

    const { documentImages } = store.getState().board
    const { background } = store.getState().board.pageCollection[pageId].meta
    // select style, selecting background doesnt trigger, bc it compares on the same reference
    const style = useCustomSelector(
        (state) => state.board.pageCollection[pageId].meta.background.style
    )

    const scheduleCaching = (r: React.RefObject<types.Image>) => {
        r.current?.clearCache()
        triggerCache((prev) => prev + 1)
    }

    // clear the cache and redraw when pagebackground changes
    useEffect(() => {
        // get correct image data for document type background
        if (style === pageType.DOC) {
            const src = documentImages[background.documentPageNum]
            // if image data not available, load document
            if (!src) {
                loadNewPDF(background.attachId).then(() => scheduleCaching(ref))
                return
            }
            setImg(() => {
                const image = new window.Image()
                image.src = src
                return image
            })
        }

        // schedule new caching
        scheduleCaching(ref)
    }, [style])

    // cache the shape on update
    useEffect(() => {
        // for some reason, document type need an additional clear cache to work properly
        if (style !== pageType.DOC) {
            ref.current?.cache({ pixelRatio: DOC_SCALE })
        }
        // setTimeout(() => ref.current?.cache({ pixelRatio: DOC_SCALE }), 500)
    }, [cache])

    return (
        <>
            <PageBoundary pageId={pageId} pageSize={pageSize} />
            <Image
                {...pageSize}
                ref={ref}
                image={img}
                sceneFunc={
                    style !== pageType.DOC ? pageBackground[style] : undefined
                }
            />
        </>
    )
})
