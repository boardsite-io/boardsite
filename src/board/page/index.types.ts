import { Layer } from "konva/lib/Layer"

export type PageInfo = {
    x: number
    y: number
    width: number
    height: number
}

export interface PageProps {
    layerRef?: React.RefObject<Layer>
    pageId: string
    pageInfo: PageInfo
}
