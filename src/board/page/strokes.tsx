import React, { memo, useEffect, useRef } from "react"
import { Group } from "react-konva"
import store from "redux/store"
import { Group as GroupType } from "konva/lib/Group"
import { useCustomSelector } from "hooks"
import { LAYER_CACHE_PXL } from "consts"
import { StrokeShape } from "board/stroke/strokeShape"
import { PageProps } from "./index.types"

const Strokes = memo<PageProps>(({ pageId, pageInfo }) => {
    const ref = useRef<GroupType>(null)

    // pageId might not be valid anymore, exit then
    if (!store.getState().board.pageCollection[pageId]) {
        return null
    }
    // select key of stroke map as trigger
    // stroke map comparison will only compare references
    const trigger = useCustomSelector((state) => state.board.renderTrigger)

    useEffect(() => {
        ref.current?.parent?.clearCache()
        setTimeout(() => {
            ref.current?.parent?.cache({ pixelRatio: LAYER_CACHE_PXL })
        }, 100)
    }, [trigger])

    const pageStrokes = store.getState().board.pageCollection[pageId]?.strokes

    return (
        <Group
            ref={ref}
            {...pageInfo}
            globalCompositeOperation="source-atop"
            listening={false}
        >
            {pageStrokes
                ? Object.keys(pageStrokes).map((id) => (
                      <StrokeShape key={id} stroke={pageStrokes[id]} />
                  ))
                : null}
        </Group>
    )
})

export default Strokes
