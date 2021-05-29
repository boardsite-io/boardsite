import {
    CANVAS_FULL_HEIGHT,
    RDP_EPSILON,
    RDP_FORCE_SECTIONS,
} from "../../../constants"
import store from "../../../redux/store"
import { Hitbox, Stroke } from "../../../types"
import { simplifyRDP } from "../../../drawing/simplify"
import { BoardLiveStroke, isContinuous } from "./livestroke"

export class BoardStroke extends BoardLiveStroke implements Stroke {
    // create a new stroke from a livestroke
    constructor(stroke: BoardLiveStroke, pageId: string) {
        super()
        // import properties from livestroke
        this.type = stroke.type
        this.style = { ...stroke.style }
        this.points = stroke.flatPoints()
        this.pointsSegments = undefined
        this.x = stroke.x
        this.y = stroke.y

        // assign a unique id
        this.id =
            Date.now().toString(36).substr(2) +
            Math.random().toString(36).substr(2, 10)
        this.pageId = pageId

        // process points according to stroke type
        this.processPoints()
    }

    id: string
    pageId: string
    points: number[]
    scaleX = 1
    scaleY = 1

    processPoints(): void {
        // for continuous types we simplify the points further
        if (isContinuous(this.type)) {
            this.points = simplifyRDP(
                this.points,
                RDP_EPSILON / 2 / store.getState().viewControl.stageScale.x,
                RDP_FORCE_SECTIONS
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

    // eslint-disable-next-line class-methods-use-this
    getHitbox(): Hitbox[] | void {
        return undefined
    }
}

function getPageIndex(pageId: string): number {
    return store.getState().boardControl.pageRank.indexOf(pageId)
}
