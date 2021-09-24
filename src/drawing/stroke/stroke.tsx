import { Vector, Polygon } from "sat"
import { LiveStroke, Scale, Point, Stroke, ToolType } from "./types"

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
    constructor(stroke: Stroke | LiveStroke) {
        this.id = stroke.id ?? createUniqueId()
        this.pageId = stroke.pageId
        this.x = stroke.x
        this.y = stroke.y
        this.scaleX = stroke.scaleX ?? 1
        this.scaleY = stroke.scaleY ?? 1
        this.type = stroke.type
        this.style = { ...stroke.style }
        this.points = [...stroke.points]
        this.calculateHitbox()
    }

    /**
     * Generate a serializable stroke for e.g. WS transmission
     */
    serialize(): Stroke {
        return { ...this, hitboxes: undefined }
    }

    /**
     * Update stroke such as position and/or scale.
     */
    update(position: Point, scale: Scale): void {
        this.x = position.x
        this.y = position.y
        this.scaleX = scale.x
        this.scaleY = scale.y
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
                    this.hitboxes.push(this.getHitboxPolygon(section))
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
                    this.getHitboxPolygon([x1, y1, x1, y2]),
                    this.getHitboxPolygon([x1, y2, x2, y2]),
                    this.getHitboxPolygon([x2, y2, x2, y1]),
                    this.getHitboxPolygon([x2, y1, x1, y1])
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
                    this.getHitboxPolygon([x1, y1, x1, y2]),
                    this.getHitboxPolygon([x1, y2, x2, y2]),
                    this.getHitboxPolygon([x2, y2, x2, y1]),
                    this.getHitboxPolygon([x2, y1, x1, y1])
                )
                break
            }

            default:
                break
        }
    }

    getHitboxPolygon([x1, y1, x2, y2]: number[]): Polygon {
        const dx = x2 - x1
        const dy = y2 - y1
        let dxw
        let dyw
        if (!dy) {
            dxw = 0
            dyw = this.style.width / 2
        } else if (!dx) {
            dxw = this.style.width / 2
            dyw = 0
        } else {
            const ratio = dx / dy
            dxw = Math.sqrt((this.style.width / 2) ** 2 / (1 + ratio ** 2))
            dyw = dxw * ratio
        }

        // compensate the effect of the scale on the width
        dxw *= this.scaleX || 1
        dyw *= this.scaleY || 1

        // calc vertices
        return new Polygon(new Vector(), [
            new Vector(x1 - dxw, y1 + dyw),
            new Vector(x2 - dxw, y2 + dyw),
            new Vector(x2 + dxw, y2 - dyw),
            new Vector(x1 + dxw, y1 - dyw),
        ])
    }
}

const createUniqueId = (): string =>
    Date.now().toString(36).substr(2) + Math.random().toString(36).substr(2, 10)
