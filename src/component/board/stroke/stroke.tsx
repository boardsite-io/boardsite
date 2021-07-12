import { Polygon } from "sat"
import { KonvaEventObject } from "konva/types/Node"
import {
    CANVAS_FULL_HEIGHT,
    RDP_EPSILON,
    RDP_FORCE_SECTIONS,
} from "../../../constants"
import store from "../../../redux/store"
import { LiveStroke, Stroke, ToolType } from "../../../types"
import { simplifyRDP } from "../../../drawing/simplify"
import { BoardLiveStroke, isContinuous } from "./livestroke"
import { getHitboxPolygon, setSelectedShapes } from "./hitbox"

export class BoardStroke extends BoardLiveStroke implements Stroke {
    /**
     * Create a new stroke from another Stroke instance
     * or a LiveStroke when pageId is given.
     */
    constructor(stroke: Stroke, pageId?: string) {
        super()
        // import properties from livestroke
        this.type = stroke.type
        this.style = { ...stroke.style }
        this.pointsSegments = undefined
        this.x = stroke.x ?? 0
        this.y = stroke.y ?? 0
        this.scaleX = stroke.scaleX || 1
        this.scaleY = stroke.scaleY || 1

        // assign a unique id
        this.id =
            stroke.id ||
            Date.now().toString(36).substr(2) +
                Math.random().toString(36).substr(2, 10)
        this.pageId = pageId || stroke.pageId

        if (pageId !== undefined) {
            // copy from livestroke
            const liveStroke = stroke as unknown as LiveStroke
            this.points = liveStroke.flatPoints?.() as number[]
            // process points according to stroke type
            this.processPoints()
        } else {
            this.points = stroke.points
        }
        this.calculateHitbox()
    }

    id: string
    pageId: string
    points: number[]
    scaleX = 1
    scaleY = 1

    hitboxes: Polygon[] = []

    /**
     * Generate a serializable stroke for e.g. WS transmission
     */
    serialize(): Stroke {
        return { ...this, hitboxes: undefined }
    }

    processPoints(): void {
        // for continuous types we simplify the points further
        if (isContinuous(this.type)) {
            this.points = simplifyRDP(
                this.points,
                RDP_EPSILON / store.getState().viewControl.stageScale.x,
                RDP_FORCE_SECTIONS + 1
            )
        }

        this.points = this.points.map((p, i) => {
            // allow a reasonable precision
            let pt = Math.round(p * 100) / 100
            if (i % 2) {
                // make y coordinates relative to page
                pt -= getPageIndex(this.pageId) * CANVAS_FULL_HEIGHT // relative y position
            }
            return pt
        })
    }

    /**
     * Update stroke such as position and/or scale.
     */
    update({ x, y, scaleX, scaleY }: Stroke): void {
        this.x = x ?? this.x
        this.y = y ?? this.y
        this.scaleX = scaleX ?? this.scaleX
        this.scaleY = scaleY ?? this.scaleY
        // recalculate hitbox
        this.calculateHitbox()
    }

    /**
     * Handle action before stroke is added to store.
     * Returns true if stroke should be added, else false
     */
    onRegister(e: KonvaEventObject<MouseEvent>): boolean {
        switch (this.type) {
            case ToolType.Eraser:
                return false
            case ToolType.Select: {
                setSelectedShapes(this, e)
                return false
            }
            default:
                return true
        }
    }

    calculateHitbox(): void {
        this.hitboxes = []
        switch (this.type) {
            case ToolType.Line:
            case ToolType.Pen: {
                // get hitboxes of all segments of the current stroke
                for (let i = 0; i < this.points.length - 2; i += 2) {
                    const section = this.points.slice(i, i + 4)
                    for (let j = 0; j < 4; j += 2) {
                        // compensate for the scale and offset
                        section[j] = section[j] * this.scaleX + this.x
                        section[j + 1] = section[j + 1] * this.scaleY + this.y
                    }
                    this.hitboxes.push(getHitboxPolygon(section, this))
                }
                break
            }

            case ToolType.Rectangle: {
                // only outline
                const x1 = this.x
                const y1 = this.y
                const x2 =
                    this.x + (this.points[2] - this.points[0]) * this.scaleX
                const y2 =
                    this.y + (this.points[3] - this.points[1]) * this.scaleY
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
                const radX = (this.points[2] - this.points[0]) / 2
                const radY = (this.points[3] - this.points[1]) / 2
                const x1 = this.x - radX * this.scaleX
                const y1 = this.y - radY * this.scaleY
                const x2 = this.x + radX * this.scaleX
                const y2 = this.y + radY * this.scaleY
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

function getPageIndex(pageId: string): number {
    return store.getState().boardControl.pageRank.indexOf(pageId)
}
