import React, { memo, useEffect } from "react"
import { Layer } from "react-konva"
import { LAYER_CACHE_PXL } from "consts"
import { PageProps } from "./index.types"
import Background from "./Background"
import Strokes from "./Strokes"

const PageLayer = memo<PageProps>(({ pageId, pageInfo, layerRef }) => {
    useEffect(() => {
        // cache the layer/page by default
        layerRef?.current?.cache({ pixelRatio: LAYER_CACHE_PXL })
    })

    return (
        <Layer ref={layerRef} width={pageInfo.width} height={pageInfo.height}>
            <Background pageId={pageId} pageInfo={pageInfo} />
            <Strokes pageId={pageId} pageInfo={pageInfo} />
        </Layer>
    )
})

export default PageLayer
