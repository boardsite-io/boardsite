import { Image } from "react-konva"
import React, { memo, useEffect, useRef } from "react"
import * as types from "konva/lib/shapes/Image"
import { backgroundStyle, LAYER_CACHE_PXL } from "consts"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { pageBackground } from "drawing/page"
import { PageProps } from "./index.types"
import PageBoundary from "./boundary"

const Background = memo<PageProps>(({ pageId, pageInfo }) => {
    // pageId might not be valid anymore, exit then
    if (!store.getState().board.pageCollection[pageId]) {
        return null
    }

    // select style, selecting background doesnt trigger, bc it compares on the same reference
    const style = useCustomSelector(
        (state) => state.board.pageCollection[pageId].meta.background.style
    )
    const documentImages = useCustomSelector(
        (state) => state.board.documentImages
    )
    const imageRef = useRef<types.Image>(null)

    useEffect(() => {
        imageRef.current?.parent?.clearCache()
        imageRef.current?.parent?.cache({
            pixelRatio: LAYER_CACHE_PXL,
        })
    })

    const { documentPageNum } =
        store.getState().board.pageCollection[pageId].meta.background

    let image: CanvasImageSource | undefined

    if (
        style === backgroundStyle.DOC &&
        documentPageNum !== undefined &&
        !!documentImages[documentPageNum]
    ) {
        image = new window.Image()
        image.src = documentImages[documentPageNum]
        image.onload = () => {
            imageRef.current?.parent?.clearCache()
            imageRef.current?.parent?.cache({
                pixelRatio: LAYER_CACHE_PXL,
            })
            imageRef.current?.cache({
                pixelRatio: LAYER_CACHE_PXL,
            })
        }
    }

    return (
        <>
            <PageBoundary pageId={pageId} pageInfo={pageInfo} />
            <Image
                {...pageInfo}
                ref={imageRef}
                image={image}
                sceneFunc={
                    style !== backgroundStyle.DOC
                        ? pageBackground[style]
                        : undefined
                }
            />
        </>
    )
})

export default Background
