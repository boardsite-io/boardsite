import { nanoid } from "@reduxjs/toolkit"
import { Shape, ShapeConfig } from "konva/types/Shape"
import { Context } from "konva/types/Context"
import { assign, pick, keys } from "lodash"
import { pageSize, pageType, sizePreset } from "consts"
import { Page, PageMeta, PageSettings } from "../types"
import { StrokeMap } from "./stroke/types"

export class BoardPage implements Page {
    constructor(page?: Page | BoardPage, pageSettings?: PageSettings) {
        this.pageId = page?.pageId ?? nanoid(8)
        this.strokes = page?.strokes ?? {}
        this.meta = {
            background: {
                style:
                    page?.meta.background.style ??
                    pageSettings?.background ??
                    pageType.BLANK, // fallback type
                attachURL: page?.meta.background.attachURL ?? "",
                documentPageNum: page?.meta.background.documentPageNum ?? 0,
            },
            width: pageSize[sizePreset.A4_LANDSCAPE].width,
            height: pageSize[sizePreset.A4_LANDSCAPE].height,
        }
        assign(this.meta, pick(pageSettings, ["width, height"]))
    }

    pageId: string
    strokes: StrokeMap = {}
    meta: PageMeta

    setID(pageId: string): BoardPage {
        this.pageId = pageId
        return this
    }

    clear(): void {
        this.strokes = {}
    }

    updateMeta(meta: PageMeta): BoardPage {
        // update only fields that are different
        assign(this.meta, pick(meta, ["width, height"]))
        assign(
            this.meta.background,
            pick(meta.background, keys(this.meta.background))
        )
        return this
    }
}

const blank = (context: Context, shape: Shape<ShapeConfig>): void => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)
}

const checkered = (context: Context, shape: Shape<ShapeConfig>): void => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)

    // make checkered math paper
    const gap = 20
    const rows = Math.ceil(height / gap)
    const columns = Math.ceil(width / gap)
    for (let i = 1; i < rows; i += 1) {
        const y = i * gap
        context.moveTo(0, y)
        context.lineTo(width, y)
    }
    for (let i = 1; i < columns; i += 1) {
        const x = i * gap
        context.moveTo(x, 0)
        context.lineTo(x, height)
    }
    context.setAttr("strokeStyle", "#00000044")
    context.stroke()
}

const ruled = (context: Context, shape: Shape<ShapeConfig>): void => {
    context.beginPath()
    // don't need to set position of rect, Konva will handle it
    const width = shape.getAttr("width")
    const height = shape.getAttr("height")
    context.rect(0, 0, width, height)
    context.fillStrokeShape(shape)

    const numRows = 30
    // make ruled math paper
    const gap = height / numRows
    for (let i = 1; i < numRows; i += 1) {
        const y = i * gap
        context.moveTo(0, y)
        context.lineTo(width, y)
    }
    context.setAttr("strokeStyle", "#00000044")
    context.stroke()
}

export const pageBackground = {
    [pageType.BLANK]: blank,
    [pageType.CHECKERED]: checkered,
    [pageType.RULED]: ruled,
}
