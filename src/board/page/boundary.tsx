import { Rect } from "react-konva"
import React, { useEffect, useRef } from "react"
import * as types from "konva/lib/shapes/Rect"
import { PageProps } from "./types"

const PageBoundary: React.FC<PageProps> = ({ pageSize }) => {
    const ref = useRef<types.Rect>(null)

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

export default PageBoundary
