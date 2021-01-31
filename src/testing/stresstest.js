import Konva from "konva"
import { CANVAS_HEIGHT, CANVAS_WIDTH, toolType } from "../constants"
import { ADD_STROKE, UPDATE_STROKE } from "../redux/slice/boardcontrol"
import store from "../redux/store"

export default function overload() {
    const numStrokes = 100
    const numPointsPerStroke = 3
    const { pageRank } = store.getState().boardControl.present

    for (let j = 0; j < numStrokes; j += 1) {
        const pageIndex = Math.floor(Math.random() * pageRank.length)
        const points = []
        for (let i = 0; i < numPointsPerStroke; i += 1) {
            const randomX = Math.random() * CANVAS_WIDTH
            const randomY = (pageIndex + Math.random()) * CANVAS_HEIGHT
            points.push(randomX, randomY)
        }
        const stroke = {
            style: {
                color: Konva.Util.getRandomColor(),
                width: 3,
            },
        }
        stroke.type = toolType.PEN
        stroke.points = points
        stroke.points = stroke.points.flat()
        stroke.pageId = pageRank[pageIndex]
        stroke.x = 0
        stroke.y = 0

        // generate a unique stroke id
        stroke.id =
            Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 4) + Date.now().toString(36).substr(4)

        // allow a reasonable precision
        stroke.points = stroke.points.map((p) => Math.round(p * 10) / 10)
        store.dispatch(ADD_STROKE(stroke))
    }
}

// All shapes update for N_OF_RUNS times
export function dispatchTest() {
    const N_OF_RUNS = 10
    const start = performance.now()
    for (let i = 0; i < N_OF_RUNS; i += 1) {
        const { pageCollection } = store.getState().boardControl.present
        Object.keys(pageCollection).forEach((pageId) => {
            const { strokes } = pageCollection[pageId]
            Object.keys(strokes).forEach((id) => {
                const stroke = strokes[id]
                store.dispatch(
                    UPDATE_STROKE({
                        x: stroke.x + (Math.random() - 0.5) * 50,
                        y: stroke.y + (Math.random() - 0.5) * 50,
                        id,
                        pageId,
                    })
                )
            })
        })
    }

    const end = performance.now()
    // eslint-disable-next-line
    console.log("sum time", end - start)
    // eslint-disable-next-line
    console.log("avg time", (end - start) / N_OF_RUNS)
}

// Single shape update
export function dispatchTestSingle() {
    const N_OF_RUNS = 1
    const start = performance.now()
    const { pageCollection } = store.getState().boardControl.present

    for (let i = 0; i < N_OF_RUNS; i += 1) {
        const firstPageId = Object.keys(pageCollection)[0]
        const { strokes } = pageCollection[firstPageId]
        const firstStrokeId = Object.keys(strokes)[0]
        const stroke = strokes[firstStrokeId]
        store.dispatch(
            UPDATE_STROKE({
                x: stroke.x + (Math.random() - 0.5) * 50,
                y: stroke.y + (Math.random() - 0.5) * 50,
                id: firstStrokeId,
                pageId: firstPageId,
            })
        )
    }

    const end = performance.now()
    // eslint-disable-next-line
    console.log("time", end - start)
}
