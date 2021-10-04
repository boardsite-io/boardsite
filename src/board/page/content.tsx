import React from "react"
import { Group } from "react-konva"
import store from "redux/store"
import { useCustomSelector } from "redux/hooks"
import { StrokeShape } from "../stroke/shape"
import { PageProps } from "./types"

const PageContent: React.FC<PageProps> = ({ pageId, pageSize }) => {
    // select key of stroke map as trigger
    // stroke map comparison will only compare references
    const strokeIds = useCustomSelector((state) =>
        Object.keys(state.board.pageCollection[pageId]?.strokes)
    )

    return (
        <>
            <Group
                {...pageSize}
                globalCompositeOperation="source-atop"
                listening={false}>
                {strokeIds.map((id) => (
                    <StrokeShape
                        key={id}
                        stroke={
                            store.getState().board.pageCollection[pageId]
                                ?.strokes[id]
                        }
                    />
                ))}
            </Group>
        </>
    )
}

export default PageContent
