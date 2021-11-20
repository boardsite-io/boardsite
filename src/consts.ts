import { Point, Tool, ToolType } from "drawing/stroke/types"
import { PageBackground } from "./types"

/**
 * Returns true if in development mode
 */
export default function isDev(): boolean {
    return !process.env.NODE_ENV || process.env.NODE_ENV === "development"
}

export const RESIZE_DEBOUNCE = 250 // debounce time in ms
export const PIXEL_RATIO = 4
export const STROKE_WIDTH_PRESETS = [0.5, 1, 2, 3, 4, 5, 7, 10, 14, 20]
export const DEFAULT_PAGE_GAP = 20
export const DEFAULT_WIDTH = STROKE_WIDTH_PRESETS[3]
export const DEFAULT_COLOR = "#000000"
export const ZOOM_IN_WHEEL_SCALE = 1.1
export const ZOOM_OUT_WHEEL_SCALE = 0.9
export const ZOOM_IN_BUTTON_SCALE = 1.1
export const ZOOM_OUT_BUTTON_SCALE = 0.9
export const ZOOM_SCALE_MAX = 5.0
export const ZOOM_SCALE_MIN = 0.5
export const DEFAULT_CURRENT_PAGE_INDEX = 0
export const DEFAULT_STAGE_X = 0
export const DEFAULT_STAGE_Y = 60
export const DEFAULT_STAGE_SCALE: Point = { x: 1, y: 1 }
export const DEFAULT_ISDRAGGABLE = false
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
export const ERASED_OPACITY = 0.4

// transform props
export const TR_BORDER_STROKE = "#00a2ff38"
export const TR_BORDER_STROKE_WIDTH = 1
export const TR_ANCHOR_FILL = "#00a2ff38"
export const TR_ANCHOR_SIZE = 8
export const TR_ANCHOR_STROKE = "#00000088"
export const TR_ANCHOR_CORNER_RADIUS = 2

export const ERASER_WIDTH = 3
export const DEFAULT_TOOL = ToolType.Pen
// allow drawing with finger
export const DEFAULT_DIRECTDRAW = true

const ELEMENTS_PER_POINT = 2
export const LIVESTROKE_SEGMENT_SIZE = 420 * ELEMENTS_PER_POINT

// scale factor for importet documents
export const DOC_SCALE = 4
export const pageType = {
    BLANK: "blank" as PageBackground,
    CHECKERED: "checkered" as PageBackground,
    RULED: "ruled" as PageBackground,
    DOC: "doc" as PageBackground,
}

// eslint-disable-next-line no-shadow
export const enum sizePreset {
    A4_LANDSCAPE,
    A4_PORTRAIT,
    Square,
}
export const pageSize = {
    [sizePreset.A4_LANDSCAPE]: { width: 620, height: 877 },
    [sizePreset.A4_PORTRAIT]: { width: 877, height: 620 },
    [sizePreset.Square]: { width: 877, height: 877 },
}

export const BACKGROUND_CACHE_PXL = 3
export const LAYER_CACHE_PXL = 4

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
