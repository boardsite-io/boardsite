import React, { memo, useEffect } from "react"
import { Layer } from "react-konva"
import { LAYER_CACHE_PXL } from "consts"
import { PageProps } from "./index.types"
import Background from "./background"
import Strokes from "./strokes"

const PageLayer = memo<PageProps>((props) => {
    useEffect(() => {
        // cache the layer/page by default
        props.layerRef?.current?.cache({ pixelRatio: LAYER_CACHE_PXL })
    })

    return (
        <Layer listening={false} ref={props.layerRef}>
            <Background {...props} />
            <Strokes {...props} />
        </Layer>
    )
})

export default PageLayer
