import { Rect } from "react-konva"
import React, { useEffect, useRef } from "react"
import * as types from "konva/lib/shapes/Rect"
import { LAYER_CACHE_PXL } from "consts"
import { PageProps } from "../index.types"

const PageBoundary: React.FC<PageProps> = ({ pageInfo }) => {
    const ref = useRef<types.Rect>(null)

    useEffect(() => {
        ref.current?.cache({ pixelRatio: LAYER_CACHE_PXL })
    }, [])

    return (
        <Rect
            {...pageInfo}
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

export default PageBoundary
