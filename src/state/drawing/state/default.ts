import {
    DEFAULT_COLOR,
    DEFAULT_FAV_TOOLS,
    DEFAULT_TOOL,
    DEFAULT_WIDTH,
    PAGE_SIZE,
} from "consts"
import { Paper } from "state/board/state/index.types"
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
    textfieldAttributes: {
        text: "",
        color: "#000000",
        hAlign: "left",
        vAlign: "top",
        font: "Lato, sans-serif",
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 16 * 1.25,
    },
    pageMeta: {
        background: { paper: Paper.Blank },
        size: PAGE_SIZE.A4_PORTRAIT,
    },
    favoriteTools: DEFAULT_FAV_TOOLS,
    erasedStrokes: {},
})
