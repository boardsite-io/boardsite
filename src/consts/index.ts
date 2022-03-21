import { Tool, ToolType } from "drawing/stroke/index.types"
import { Paper } from "state/board/state/index.types"
import { ViewTransform } from "state/view/state/index.types"

/* 
These constants define the distance of each respective scroll limit to the upper viewport 
border, e.g., a first page limit value of 0.3 means the upper border of the first 
page can at most be 30% of the viewport height away from the upper viewport border. 
*/
export const SCROLL_LIMIT_FIRST_PAGE = 0.25 // Calculated from upper border!
export const SCROLL_LIMIT_LAST_PAGE = 0.75 // Calculated from upper border!
export const SCROLL_LIMIT_HORIZONTAL = 0.5 // Calculated from side borders!
export const MAX_PIXEL_SCALE = 4
export const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1

export const MIME_TYPE_WORKSPACE = "application/boardio"
export const MIME_TYPE_PDF = "application/pdf"
export const FILE_EXTENSION_WORKSPACE = ".boardio"
export const FILE_EXTENSION_PDF = ".pdf"
export const FILE_DESCRIPTION_WORKSPACE = "Workspace file"
export const FILE_DESCRIPTION_PDF = "PDF file"
export const FILE_NAME_PDF = "file"
export const FILE_NAME_WORKSPACE = "workspace"

export const NOTIFICATION_TRANSITION = 300 // in ms
export const DEFAULT_NOTIFICATION_DURATION = 2000
export const MAX_FAVORITE_TOOLS_FREE = 4
export const TRANSFORM_PIXEL_SCALE_DEBOUNCE = 100 // debounce time in ms
export const STROKE_WIDTH_PRESETS = [0.5, 1, 2, 3, 4, 5, 7, 10, 14, 20]
export const DEFAULT_PAGE_GAP = 20
export const DEFAULT_WIDTH = STROKE_WIDTH_PRESETS[3]
export const DEFAULT_COLOR = "#000000"
export const ZOOM_IN_WHEEL_SCALE = 1.05
export const ZOOM_OUT_WHEEL_SCALE = 0.95
export const ZOOM_IN_BUTTON_SCALE = 1.1
export const ZOOM_OUT_BUTTON_SCALE = 0.9
export const ZOOM_SCALE_MAX = 5.0
export const ZOOM_SCALE_MIN = 0.5
export const DEFAULT_CURRENT_PAGE_INDEX = 0
export const DEFAULT_VIEW_OFFSET_X = window.innerWidth / 2
export const DEFAULT_VIEW_OFFSET_Y = 60
export const DEFAULT_VIEW_SCALE = 1
export const DEFAULT_VIEW_TRANSFORM: ViewTransform = {
    xOffset: DEFAULT_VIEW_OFFSET_X,
    yOffset: DEFAULT_VIEW_OFFSET_Y,
    scale: DEFAULT_VIEW_SCALE,
}
export const DEFAULT_KEEP_CENTERED = false

export const ERASER_WIDTH = 3
export const ERASED_OPACITY = 0.4
export const DEFAULT_TOOL = ToolType.Pen
// allow drawing with finger
export const DEFAULT_DIRECTDRAW = true

export const PAGE_SIZE = {
    A4_PORTRAIT: { width: 620, height: 877 },
    A4_LANDSCAPE: { width: 877, height: 620 },
}

export const PAPER: Record<string, Paper> = {
    BLANK: "blank",
    CHECKERED: "checkered",
    RULED: "ruled",
    DOC: "doc",
}

const FAVORITE_TOOL_1: Tool = {
    type: ToolType.Pen,
    style: {
        color: "#000000",
        width: STROKE_WIDTH_PRESETS[2],
        opacity: 1,
    },
}
const FAVORITE_TOOL_2: Tool = {
    type: ToolType.Pen,
    style: {
        color: "#ff0000",
        width: STROKE_WIDTH_PRESETS[2],
        opacity: 1,
    },
}
const FAVORITE_TOOL_3: Tool = {
    type: ToolType.Rectangle,
    style: {
        color: "#0000ff",
        width: STROKE_WIDTH_PRESETS[4],
        opacity: 1,
    },
}

export const DEFAULT_FAV_TOOLS = [
    FAVORITE_TOOL_1,
    FAVORITE_TOOL_2,
    FAVORITE_TOOL_3,
]
