import { LiveStroke } from "drawing/livestroke/index.types"
import { assign, pick } from "lodash"
import { Polygon } from "sat"
import { getHitboxPolygon } from "./hitbox"
import {
    Scale,
    Point,
    Stroke,
    ToolType,
    StrokeUpdate,
    SerializedStroke,
} from "./index.types"

export class BoardStroke implements Stroke {
    type: ToolType
    style: {
        color: string
        width: number
        opacity: number
    }

    id: string
    pageId: string

    x: number
    y: number
    scaleX: number
    scaleY: number

    points: number[]
    hitboxes: Polygon[] = []

    /**
     * Create a new stroke from another Stroke instance
     */
    constructor(stroke: Stroke | LiveStroke | SerializedStroke) {
        this.id = stroke.id ?? createUniqueId()
        this.pageId = stroke.pageId
        this.x = stroke.x
        this.y = stroke.y
        this.scaleX = stroke.scaleX ?? 1
        this.scaleY = stroke.scaleY ?? 1
        this.type = stroke.type
        this.style = { ...stroke.style }
        this.points = [...stroke.points]

        // Check if hitboxes need to be calculated
        if (stroke.hitboxes?.length) {
            this.hitboxes = stroke.hitboxes
        } else {
            this.calculateHitbox()
        }
    }

    /**
     * Generate a serializable stroke for e.g. WS transmission
     */
    serialize(): SerializedStroke {
        return pick(this, [
            "id",
            "pageId",
            "type",
            "x",
            "y",
            "scaleX",
            "scaleY",
            "points",
            "style",
        ])
    }

    async deserialize(): Promise<Stroke> {
        // nop
        return this
    }

    // returns a copy of the stroke with the update properties
    serializeUpdate(): StrokeUpdate {
        return pick(this, [
            "id",
            "pageId",
            "type",
            "x",
            "y",
            "scaleX",
            "scaleY",
        ])
    }

    /**
     * Update stroke such as position and/or scale.
     */
    update(strokeUpdate: Stroke | StrokeUpdate): Stroke {
        assign(this, pick(strokeUpdate, ["x", "y", "scaleX", "scaleY"]))
        this.calculateHitbox() // recalculate hitbox
        return this
    }

    getPosition(): Point {
        return {
            x: this.x,
            y: this.y,
        }
    }

    getScale(): Scale {
        return {
            x: this.scaleX,
            y: this.scaleY,
        }
    }

    calculateHitbox(): void {
        const { type, x, y, scaleX, scaleY, points } = this
        this.hitboxes = []
        switch (type) {
            case ToolType.Line:
            case ToolType.Pen: {
                // get hitboxes of all segments of the current stroke
                for (let i = 0; i < points.length - 2; i += 2) {
                    const section = points.slice(i, i + 4)
                    for (let j = 0; j < 4; j += 2) {
                        // compensate for the scale and offset
                        section[j] = (section[j] + x) * scaleX
                        section[j + 1] = (section[j + 1] + y) * scaleY
                    }
                    this.hitboxes.push(
                        getHitboxPolygon(section, this.style.width, {
                            x: this.scaleX,
                            y: this.scaleY,
                        })
                    )
                }
                break
            }

            case ToolType.Rectangle: {
                let [x1, y1, x2, y2] = points
                x1 = (x1 + x) * scaleX
                y1 = (y1 + y) * scaleY
                x2 = (x2 + x) * scaleX
                y2 = (y2 + y) * scaleY
                this.hitboxes.push(
                    getHitboxPolygon([x1, y1, x1, y2], this.style.width, {
                        x: this.scaleX,
                        y: this.scaleY,
                    }),
                    getHitboxPolygon([x1, y2, x2, y2], this.style.width, {
                        x: this.scaleX,
                        y: this.scaleY,
                    }),
                    getHitboxPolygon([x2, y2, x2, y1], this.style.width, {
                        x: this.scaleX,
                        y: this.scaleY,
                    }),
                    getHitboxPolygon([x2, y1, x1, y1], this.style.width, {
                        x: this.scaleX,
                        y: this.scaleY,
                    })
                )
                break
            }

            case ToolType.Circle: {
                let [x1, y1, x2, y2] = points
                x1 = (x1 + x) * scaleX
                y1 = (y1 + y) * scaleY
                x2 = (x2 + x) * scaleX
                y2 = (y2 + y) * scaleY
                this.hitboxes.push(
                    getHitboxPolygon([x1, y1, x1, y2], this.style.width, {
                        x: this.scaleX,
                        y: this.scaleY,
                    }),
                    getHitboxPolygon([x1, y2, x2, y2], this.style.width, {
                        x: this.scaleX,
                        y: this.scaleY,
                    }),
                    getHitboxPolygon([x2, y2, x2, y1], this.style.width, {
                        x: this.scaleX,
                        y: this.scaleY,
                    }),
                    getHitboxPolygon([x2, y1, x1, y1], this.style.width, {
                        x: this.scaleX,
                        y: this.scaleY,
                    })
                )
                break
            }

            default:
                break
        }
    }
}

const createUniqueId = (): string =>
    Date.now().toString(36).substr(2) + Math.random().toString(36).substr(2, 10)
