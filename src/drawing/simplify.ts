import { getStrokePoints, StrokeOptions } from "perfect-freehand"

export const perfectDrawing = (points: number[]): number[] => {
    const formattedPoints: number[][] = []
    for (let i = 0; i < points.length; i += 2) {
        formattedPoints.push([points[i], points[i + 1]])
    }

    const options: StrokeOptions = {
        // The base size (diameter) of the stroke.
        size: undefined, // 1 + styles.strokeWidth * 1.5,
        // The effect of pressure on the stroke's size.
        thinning: 0.65,
        // How much to soften the stroke's edges.
        smoothing: 0.65,
        // How much to streamline the stroke.
        streamline: 0.65,
        // Whether to simulate pressure based on velocity.
        simulatePressure: false,
        // An easing function to apply to each point's pressure.
        easing: undefined,
        // Tapering options for the start of the line.
        start: {
            // cap: true,
            // taper: 0,
            // easing: (t) => t,
        },
        // Tapering options for the end of the line.
        end: {
            // cap: true,
            // taper: 0,
            // easing: (t) => t,
        },
        last: true, // Whether the stroke is complete.
    }

    const stroke = getStrokePoints(formattedPoints, options)

    const perfectPoints: number[] = []
    stroke.map((x) => perfectPoints.push(...x.point))

    return perfectPoints
}
