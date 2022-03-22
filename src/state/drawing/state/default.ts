import {
    PAPER,
    DEFAULT_COLOR,
    DEFAULT_FAV_TOOLS,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    PAGE_SIZE,
} from "consts"
import { DrawingState } from "./index.types"

export const getDefaultDrawingState = (): DrawingState => ({
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
        background: { paper: PAPER.BLANK },
        size: PAGE_SIZE.A4_PORTRAIT,
    },
    favoriteTools: DEFAULT_FAV_TOOLS,
    erasedStrokes: {},
})
