import { nanoid } from "nanoid"
import { BoardStroke } from "drawing/stroke"
import { reduceRecord } from "util/lib"
import { Page, PageMeta, SerializedPage } from "state/board/state/index.types"
import { assign, cloneDeep, pick } from "lodash"
import { drawing } from "state/drawing"
import {
    SerializedStroke,
    Stroke,
    StrokeCollection,
} from "../stroke/index.types"

export class BoardPage implements Page {
    constructor(page?: Page) {
        if (page) {
            this.pageId = page.pageId
            this.strokes = page.strokes
            this.meta = page.meta
        } else {
            this.pageId = nanoid(8)
            this.strokes = {}
            this.meta = cloneDeep(drawing.getState().pageMeta)
        }
    }

    pageId: string
    strokes: StrokeCollection
    meta: PageMeta

    setID(pageId: string): BoardPage {
        this.pageId = pageId
        return this
    }

    clear(): void {
        this.strokes = {}
    }

    updateMeta(meta: PageMeta): BoardPage {
        this.meta = meta
        return this
    }

    addStrokes(strokes: (Stroke | SerializedStroke)[]): BoardPage {
        strokes.forEach((stroke) => {
            this.strokes[stroke.id] = new BoardStroke(stroke)
        })
        return this
    }

    serialize(): SerializedPage {
        const strokes = reduceRecord(this.strokes, (stroke) =>
            stroke.serialize()
        )
        return {
            pageId: this.pageId,
            meta: this.meta,
            strokes,
        }
    }

    async deserialize(serialized: SerializedPage): Promise<Page> {
        assign(this, pick(serialized, ["pageId", "meta"]))
        this.strokes = reduceRecord(
            serialized.strokes,
            (stroke) => new BoardStroke(stroke)
        )
        return this
    }
}
