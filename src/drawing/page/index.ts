import { nanoid } from "@reduxjs/toolkit"
import { backgroundStyle, pageSize } from "consts"
import { BoardStroke } from "drawing/stroke"
import { Page, PageMeta } from "redux/board/index.types"
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
            this.meta = {
                size: pageSize.a4landscape,
                background: {
                    style: backgroundStyle.BLANK, // fallback type
                },
            }
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
}
