import React, { memo, useEffect, useRef } from "react"
import { Group } from "react-konva"
import store from "redux/store"
import { Group as GroupType } from "konva/lib/Group"
import { useCustomSelector } from "hooks"
import { LAYER_CACHE_PXL } from "consts"
import { PageProps } from "../index.types"
import StrokeShape from "../../StrokeShape"

const Strokes = memo<PageProps>(({ pageId, pageInfo }) => {
    const groupRef = useRef<GroupType>(null)

    // pageId might not be valid anymore, exit then
    if (!store.getState().board.pageCollection[pageId]) {
        return null
    }
    // select key of stroke map as trigger
    // stroke map comparison will only compare references
    const trigger = useCustomSelector((state) => state.board.renderTrigger)

    useEffect(() => {
        const pageLayer = groupRef.current?.parent
        if (pageLayer) {
            pageLayer.clearCache()
            pageLayer.cache({ pixelRatio: LAYER_CACHE_PXL })
        }
    }, [trigger])

    const pageStrokes = store.getState().board.pageCollection[pageId]?.strokes

    return (
        <Group
            ref={groupRef}
            {...pageInfo}
            globalCompositeOperation="source-atop"
            listening={false}
        >
            {pageStrokes
                ? Object.keys(pageStrokes).map((id) => (
                      <StrokeShape
                          key={id}
                          stroke={pageStrokes[id]}
                          groupRef={groupRef}
                      />
                  ))
                : null}
        </Group>
    )
})

export default Strokes
