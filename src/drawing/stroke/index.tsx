import { LiveStroke } from "drawing/livestroke/index.types"
import { assign, pick } from "lodash"
import { Polygon } from "sat"
import { getStrokeHitboxes } from "drawing/hitbox"
import {
    Point,
    Scale,
    SerializedStroke,
    Stroke,
    StrokeUpdate,
    Textfield,
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
    textfield?: Textfield | undefined
    isErased: boolean

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
        this.textfield = stroke.textfield
        this.isErased = false

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
            "textfield",
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
        assign(
            this,
            pick(strokeUpdate, [
                "x",
                "y",
                "scaleX",
                "scaleY",
                "textfield",
                "isErased",
            ])
        )
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
        this.hitboxes = getStrokeHitboxes(this)
    }
}

const createUniqueId = (): string =>
    Date.now().toString(36).substr(2) + Math.random().toString(36).substr(2, 10)
