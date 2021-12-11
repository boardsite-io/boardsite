import { nanoid } from "@reduxjs/toolkit"
import { backgroundStyle, pageSize } from "consts"
import { Page, PageMeta } from "redux/board/board.types"
import { StrokeMap } from "../stroke/index.types"

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
    strokes: StrokeMap
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
}
