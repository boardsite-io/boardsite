import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Layer, Stage, Rect } from "react-konva"
import * as types from "konva/types/Layer"
import { StrokeShape } from "board/stroke/shape"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants"
import store from "../redux/store"
import { pageBackground } from "./page"

export async function pagesToDataURL(
    pixelRatio: number,
    drawBackground?: boolean
): Promise<string[]> {
    const pages = store.getState().boardControl.pageRank

    const imgs = pages.map(async (pageId) => {
        const strokeIds = Object.keys(
            store.getState().boardControl.pageCollection[pageId].strokes
        )
        const { style } =
            store.getState().boardControl.pageCollection[pageId]?.meta
                ?.background

        const tmp = document.createElement("div")

        let ref: React.Ref<types.Layer> = null
        const LayerTest = () => {
            ref = React.useRef<types.Layer>(null)
            return (
                <Stage>
                    <Provider store={store}>
                        <Layer
                            ref={ref}
                            height={CANVAS_HEIGHT}
                            width={CANVAS_WIDTH}>
                            <Rect
                                height={CANVAS_HEIGHT}
                                width={CANVAS_WIDTH}
                                stroke="#000000"
                                strokeWidth={0.1}
                                sceneFunc={
                                    drawBackground
                                        ? pageBackground[style]
                                        : undefined
                                }
                            />
                            {strokeIds.map((id) => (
                                <StrokeShape
                                    key={id}
                                    stroke={
                                        store.getState().boardControl
                                            .pageCollection[pageId]?.strokes[id]
                                    }
                                />
                            ))}
                        </Layer>
                    </Provider>
                </Stage>
            )
        }
        ReactDOM.render(<LayerTest />, tmp)
        const data = (
            ref as unknown as React.RefObject<types.Layer>
        )?.current?.toDataURL({
            pixelRatio,
        })
        tmp.remove()
        return data ?? ""
    })

    return Promise.all(imgs)
}

export function download(data: string, name: string): void {
    const link = document.createElement("a")
    link.download = name
    // eslint-disable-next-line prefer-destructuring
    link.href = data
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
