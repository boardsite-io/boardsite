import {
    backgroundStyle,
    DEFAULT_COLOR,
    DEFAULT_DIRECTDRAW,
    DEFAULT_FAV_TOOLS,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    pageSize,
} from "consts"
import { DrawingState } from "./index.types"

export const getDefaultDrawingState = (): DrawingState => ({
    directDraw: DEFAULT_DIRECTDRAW,
    tool: {
        type: DEFAULT_TOOL,
        latestDrawType: DEFAULT_TOOL,
        style: {
            color: DEFAULT_COLOR,
            width: DEFAULT_WIDTH,
            opacity: 1,
        },
    },
    pageMeta: {
        background: { style: backgroundStyle.BLANK },
        size: pageSize.a4portrait,
    },
    favoriteTools: DEFAULT_FAV_TOOLS,
    erasedStrokes: {},
})
