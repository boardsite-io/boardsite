import { cloneDeep, pick } from "lodash"
import { Polygon } from "sat"
import { getStrokeHitboxes } from "drawing/hitbox"
import { LiveStroke } from "drawing/livestroke/index.types"
import { FAVORITE_TOOL_1 } from "consts"
import {
    Point,
    Scale,
    SerializedStroke,
    Stroke,
    StrokeUpdate,
    Textfield,
} from "./index.types"

export class BoardStroke implements Stroke {
    type = FAVORITE_TOOL_1.type
    style = FAVORITE_TOOL_1.style
    id = ""
    pageId = ""
    x = 0
    y = 0
    scaleX = 1
    scaleY = 1
    points: number[] = []
    hitboxes: Polygon[] = []
    textfield?: Textfield
    isHidden = false

    /**
     * Create a new stroke from another Stroke instance
     */
    constructor(stroke: SerializedStroke | LiveStroke) {
        this.update(stroke)
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

    /**
     * Update stroke such as position and/or scale.
     */
    update(strokeUpdate: StrokeUpdate): Stroke {
        const strokeCopy = cloneDeep(strokeUpdate)

        this.id = (strokeCopy.id ?? this.id) || createUniqueId()
        this.pageId = strokeCopy.pageId ?? this.pageId
        this.x = strokeCopy.x ?? this.x
        this.y = strokeCopy.y ?? this.y
        this.scaleX = strokeCopy.scaleX ?? this.scaleX
        this.scaleY = strokeCopy.scaleY ?? this.scaleY
        this.type = strokeCopy.type ?? this.type
        this.style = strokeCopy.style ?? this.style
        this.points = strokeCopy.points ?? this.points
        this.textfield = strokeCopy.textfield ?? this.textfield

        this.isHidden = false
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
