import { getStrokePoints, StrokeOptions } from "perfect-freehand"

export const perfectDrawing = (points: number[]): number[] => {
    const formattedPoints = new Array(points.length / 2)
        .fill(undefined)
        .map((_, i) => [points[2 * i], points[2 * i + 1]])

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
        // easing: (t) => t,
        // Tapering options for the start of the line.
        // start: {
        //     cap: true,
        //     taper: 0,
        //     easing: (t) => t,
        // },
        // Tapering options for the end of the line.
        // end: {
        //     cap: true,
        //     taper: 0,
        //     easing: (t) => t,
        // },
        // Whether the stroke is complete.
        last: true,
    }

    return getStrokePoints(formattedPoints, options)
        .map((strokePoint) => strokePoint.point)
        .flat()
}
