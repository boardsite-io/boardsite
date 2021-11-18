import { LiveStroke } from "drawing/stroke/types"

export interface PageProps {
    pageId: string
    pageSize: {
        x: number
        y: number
        width: number
        height: number
    }
    liveStroke?: () => LiveStroke
    setLiveStrokeTrigger?: React.Dispatch<React.SetStateAction<number>>
}
