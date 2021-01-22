export const CANVAS_WIDTH = 620
export const CANVAS_HEIGHT = 877
export const CANVAS_PIXEL_RATIO = 1 // css forces canvas to be in a smaller frame but with high res for better clarity
export const WIDTH_MIN = 1
export const WIDTH_MAX = 40
export const WIDTH_STEP = 10
export const DEFAULT_WIDTH = 4
export const DEFAULT_COLOR = "#000000"
export const DEFAULT_ACTIVE = "true"
export const MIN_SAMPLE_COUNT = 5

// drawing stuff
export const type = {
    PEN: 0,
    ERASER: 1,
    LINE: 2,
    TRIANGLE: 3,
    CIRCLE: 4,
}
export const DEFAULT_TOOL = type.PEN
