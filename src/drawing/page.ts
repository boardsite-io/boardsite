import { nanoid } from "@reduxjs/toolkit"
import { Shape, ShapeConfig } from "konva/types/Shape"
import { Context } from "konva/types/Context"
import { ADD_PAGE } from "redux/board/board"
import { pageType } from "consts"
import store from "redux/store"
import { Page, PageBackground, PageMeta, PageSize } from "../types"
import { StrokeMap } from "./stroke/types"

export class BoardPage implements Page {
    constructor(
        style?: PageBackground,
        pageNum?: number,
        attachURL?: URL | string,
        size?: PageSize
    ) {
        const { pageSettings } = store.getState().board
        this.pageId = nanoid(8)
        this.meta = {
            background: {
                style: style ?? pageSettings.background, // fallback type
                attachURL: attachURL ?? "",
                documentPageNum: pageNum ?? 0,
            },
            width: size?.width ?? pageSettings.size.width,
            height: size?.height ?? pageSettings.size.height,
        }
    }

    pageId: string
    strokes: StrokeMap = {}
    meta: PageMeta

    setID(pageId: string): BoardPage {
        this.pageId = pageId
        return this
    }

    add(index?: number): void {
        store.dispatch(ADD_PAGE({ page: this, index }))
    }

    clear(): void {
        this.strokes = {}
    }

    updateMeta(meta: PageMeta): BoardPage {
        // update only fields that are different
        this.meta = { ...this.meta, ...meta }
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
