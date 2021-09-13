import { Polygon } from "sat"
import { getHitboxPolygon } from "board/hitbox/hitbox"
import { BoardStrokeType, Stroke, ToolType } from "./types"

export class BoardStroke implements BoardStrokeType {
    /**
     * Create a new stroke from another Stroke instance
     */
    constructor(stroke: Stroke) {
        this.id = stroke.id
        this.pageId = stroke.pageId
        this.x = stroke.x
        this.y = stroke.y
        this.scaleX = stroke.scaleX
        this.scaleY = stroke.scaleY
        this.type = stroke.type
        this.style = { ...stroke.style }
        this.points = [...stroke.points]
        this.calculateHitbox()
    }
    id: string
    pageId: string
    x: number
    y: number
    scaleX: number
    scaleY: number
    type: ToolType
    style: {
        color: string
        width: number
        opacity: number
    }
    points: number[]
    hitboxes: Polygon[] = []

    /**
     * Generate a serializable stroke for e.g. WS transmission
     */
    serialize(): BoardStrokeType {
        return { ...this, hitboxes: undefined }
    }

    /**
     * Update stroke such as position and/or scale.
     */
    update({ x, y, scaleX, scaleY }: Stroke): void {
        this.x = x ?? this.x
        this.y = y ?? this.y
        this.scaleX = scaleX ?? this.scaleX
        this.scaleY = scaleY ?? this.scaleY
        this.calculateHitbox() // recalculate hitbox
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
                        section[j] = section[j] * scaleX + x
                        section[j + 1] = section[j + 1] * scaleY + y
                    }
                    this.hitboxes.push(getHitboxPolygon(section, this))
                }
                break
            }

            case ToolType.Rectangle: {
                // only outline
                const x1 = x
                const y1 = y
                const x2 = x + (points[2] - points[0]) * scaleX
                const y2 = y + (points[3] - points[1]) * scaleY
                this.hitboxes.push(
                    getHitboxPolygon([x1, y1, x1, y2], this),
                    getHitboxPolygon([x1, y2, x2, y2], this),
                    getHitboxPolygon([x2, y2, x2, y1], this),
                    getHitboxPolygon([x2, y1, x1, y1], this)
                )
                break
            }

            case ToolType.Circle: {
                // only outline
                const radX = (points[2] - points[0]) / 2
                const radY = (points[3] - points[1]) / 2
                const x1 = x - radX * scaleX
                const y1 = y - radY * scaleY
                const x2 = x + radX * scaleX
                const y2 = y + radY * scaleY
                this.hitboxes.push(
                    getHitboxPolygon([x1, y1, x1, y2], this),
                    getHitboxPolygon([x1, y2, x2, y2], this),
                    getHitboxPolygon([x2, y2, x2, y1], this),
                    getHitboxPolygon([x2, y1, x1, y1], this)
                )
                break
            }

            default:
                break
        }
    }
}
