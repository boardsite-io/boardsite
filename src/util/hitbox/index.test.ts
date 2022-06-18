import { getEllipseOutline } from "."

describe("getEllipseOutline", () => {
    it("returns the correct outline points for a circle", () => {
        const e = { x: 5, y: 5, rx: 1, ry: 1, segmentsPerQuarter: 2 }

        const outlinePoints = getEllipseOutline(e)
        const offset = Math.sqrt(e.rx / 2) // Since we are testing a circle

        expect(outlinePoints.length).toEqual(8)
        expect(outlinePoints).toEqual([
            { x: e.x + e.rx, y: e.y },
            { x: e.x + offset, y: e.y + offset },
            { x: e.x, y: e.y + e.ry },
            { x: e.x - offset, y: e.y + offset },
            { x: e.x - e.rx, y: e.y },
            { x: e.x - offset, y: e.y - offset },
            { x: e.x, y: e.y - e.ry },
            { x: e.x + offset, y: e.y - offset },
        ])
    })
})
