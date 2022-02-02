import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import store from "redux/store"
import { Layer, Stage, Rect } from "react-konva"
import type { Layer as LayerType } from "konva/lib/Layer"
import Shape from "View/BoardStage/Shape"
import { LineCap, LineJoin } from "konva/lib/Shape"
import { PDF_EXPORT_PIXEL_RATIO } from "consts"
import { pageBackground } from "drawing/page/backgrounds"

let renderLayerRef: React.Ref<LayerType> = null

/**
 * Renders a page as image data.
 * @param drawBackground draw the page background (ruled, checkered)
 * @returns image data urls
 */
export const pageToDataURL = async (
    pageId: string,
    drawBackground?: boolean
): Promise<string | undefined> => {
    const tmp = document.createElement("div")

    ReactDOM.render(
        <RenderLayer pageId={pageId} drawBackground={drawBackground} />,
        tmp
    )
    const data = (
        renderLayerRef as unknown as React.RefObject<LayerType>
    )?.current?.toDataURL({
        pixelRatio: PDF_EXPORT_PIXEL_RATIO,
    })

    tmp.remove()
    return data
}

interface RenderLayerProps {
    pageId: string
    drawBackground?: boolean
}

const RenderLayer: React.FC<RenderLayerProps> = ({
    pageId,
    drawBackground,
}) => {
    renderLayerRef = React.useRef<LayerType>(null)

    const page = store.getState().board.pageCollection[pageId]
    if (!page) return null

    const { background, size } = page.meta

    return (
        <Stage height={size.height} width={size.width}>
            <Provider store={store}>
                <Layer ref={renderLayerRef}>
                    <Rect
                        height={size.height}
                        width={size.width}
                        sceneFunc={
                            drawBackground
                                ? pageBackground[background.style]
                                : undefined
                        }
                    />
                    {Object.keys(page.strokes).map((id) => {
                        const stroke = page.strokes[id]
                        if (!stroke) return null

                        const pdfShapeProps = {
                            name: stroke.pageId,
                            id: stroke.id,
                            x: stroke.x,
                            y: stroke.y,
                            scaleX: stroke.scaleX,
                            scaleY: stroke.scaleY,
                            lineCap: "round" as LineCap,
                            lineJoin: "round" as LineJoin,
                            stroke: stroke.style.color,
                            fill: undefined,
                            strokeWidth: stroke.style.width,
                            opacity: stroke.style.opacity,
                            listening: false,
                            draggable: false,
                            onDragStart: undefined,
                            onDragEnd: undefined,
                            shadowForStrokeEnabled: false,
                            points: stroke.points,
                        }

                        return (
                            <Shape
                                key={id}
                                stroke={stroke}
                                shapeProps={pdfShapeProps}
                            />
                        )
                    })}
                </Layer>
            </Provider>
        </Stage>
    )
}
