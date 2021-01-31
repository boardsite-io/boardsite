import { CANVAS_HEIGHT, CANVAS_WIDTH, toolType } from "../constants"
import { ADD_STROKE } from "../redux/slice/boardcontrol"
import store from "../redux/store"

export default function overload() {
    const numStrokes = 5
    const numPointsPerStroke = 30
    const { pageRank } = store.getState().boardControl.present

    for (let j = 0; j < numStrokes; j += 1) {
        const pageIndex = Math.floor(Math.random() * pageRank.length)
        const points = []
        for (let i = 0; i < numPointsPerStroke; i += 2) {
            const randomX = Math.random() * CANVAS_WIDTH
            const randomY = (pageIndex + Math.random()) * CANVAS_HEIGHT
            points.push(randomX, randomY)
        }

        const randomColor = `#${`000000${Math.random()
            .toString(16)
            .slice(2, 8)
            .toUpperCase()}`.slice(-6)}`
        const stroke = {
            style: {
                color: randomColor,
                width: 3,
            },
        }
        stroke.type = toolType.PEN
        stroke.points = points
        stroke.points = stroke.points.flat()
        stroke.pageId = pageRank[pageIndex]

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
