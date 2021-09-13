import { Point, Tool, ToolType } from "board/stroke/types"
import { PageBackground } from "./types"

/**
 * Returns true if in development mode
 */
export default function isDev(): boolean {
    return !process.env.NODE_ENV || process.env.NODE_ENV === "development"
}

export const STROKE_WIDTH_PRESETS = [0.5, 1, 2, 3, 4, 5, 7, 10, 14, 20]
export const CANVAS_WIDTH = 620
export const CANVAS_HEIGHT = 877
export const CANVAS_GAP = 20
export const CANVAS_FULL_HEIGHT = CANVAS_HEIGHT + CANVAS_GAP
export const DEFAULT_WIDTH = STROKE_WIDTH_PRESETS[3]
export const DEFAULT_COLOR = "#000000"
export const DEFAULT_ISPANMODE = false
export const ZOOM_IN_WHEEL_SCALE = 1.1
export const ZOOM_OUT_WHEEL_SCALE = 0.9
export const ZOOM_IN_BUTTON_SCALE = 1.1
export const ZOOM_OUT_BUTTON_SCALE = 0.9
export const ZOOM_SCALE_MAX = 5.0
export const ZOOM_SCALE_MIN = 0.5
export const DEFAULT_CURRENT_PAGE_INDEX = 0
export const DEFAULT_STAGE_WIDTH = window.innerWidth
export const DEFAULT_STAGE_HEIGHT = window.innerHeight
export const DEFAULT_STAGE_X = 0
export const DEFAULT_STAGE_Y = 60
export const DEFAULT_STAGE_SCALE: Point = { x: 1, y: 1 }
export const DEFAULT_ISDRAGGABLE = false
export const DEFAULT_ISLISTENING = false
export const DEFAULT_ISMOUSEDOWN = false
export const DEFAULT_KEEP_CENTERED = false
export const DEFAULT_HIDE_NAVBAR = false
export const DRAG_SHADOW_BLUR = 4

// select props
export const SEL_STROKE_ENABLED = false
export const SEL_STROKE = "#00ff00ff"
export const SEL_FILL_ENABLED = true
export const SEL_FILL = "#00a2ff38"

// opacity of strokes when moved
export const MOVE_OPACITY = 0.6

// transform props
export const TR_BORDER_STROKE = "#00a2ff38"
export const TR_BORDER_STROKE_WIDTH = 1
export const TR_ANCHOR_FILL = "#00a2ff38"
export const TR_ANCHOR_SIZE = 8
export const TR_ANCHOR_STROKE = "#00000088"
export const TR_ANCHOR_CORNER_RADIUS = 2

export const DEFAULT_TOOL = ToolType.Pen
// allow drawing with finger
export const DEFAULT_DIRECTDRAW = true
// maximum number of points a livestroke can have until cached
export const MAX_LIVESTROKE_PTS = 20
// epsilon for the Ramer–Douglas–Peucker algorithm
export const RDP_EPSILON = 0.4
// force the rdp algorithm to split the curve at least 2^3 times
export const RDP_FORCE_SECTIONS = 3

// scale factor for importet documents
export const DOC_SCALE = 4
export const pageType = {
    BLANK: "blank" as PageBackground,
    CHECKERED: "checkered" as PageBackground,
    RULED: "ruled" as PageBackground,
    DOC: "doc" as PageBackground,
}

const tool1: Tool = {
    type: ToolType.Pen,
    style: {
        color: "#000000",
        width: STROKE_WIDTH_PRESETS[2],
        opacity: 1,
    },
}
const tool2: Tool = {
    type: ToolType.Pen,
    style: {
        color: "#0211a3",
        width: STROKE_WIDTH_PRESETS[3],
        opacity: 1,
    },
}
const tool3: Tool = {
    type: ToolType.Pen,
    style: {
        color: "#ff0000",
        width: STROKE_WIDTH_PRESETS[4],
        opacity: 1,
    },
}

export const DEFAULT_FAV_TOOLS = [tool1, tool2, tool3]
