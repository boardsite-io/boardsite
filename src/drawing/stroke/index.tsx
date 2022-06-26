import { LiveStroke } from "drawing/livestroke/index.types"
import { assign, pick } from "lodash"
import { Polygon } from "sat"
import { getStrokeHitbox } from "drawing/hitbox"
import {
    Point,
    Scale,
    SerializedStroke,
    Stroke,
    StrokeUpdate,
    ToolType,
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
        this.scaleX = stroke.scaleX
        this.scaleY = stroke.scaleY
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
        this.hitboxes = getStrokeHitbox(this)
    }
}

const createUniqueId = (): string =>
    Date.now().toString(36).substr(2) + Math.random().toString(36).substr(2, 10)
