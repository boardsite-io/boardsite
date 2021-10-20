import { Point } from "drawing/stroke/types"

/**
 * Find the perpendicular distance between a point and a reference line.
 * @param point
 * @param line
 * @returns Perpendicular distance
 */
export function perpendicularDistance(
    point: Point,
    line: [Point, Point]
): number {
    const slope = (line[1].y - line[0].y) / (line[1].x - line[0].x)
    const intercept = line[0].y - slope * line[0].x
    return (
        Math.abs(slope * point.x - point.y + intercept) /
        Math.sqrt(slope ** 2 + 1)
    )
}

/**
 * Ramer–Douglas–Peucker algorithm, an algorithm that decimates
 * a curve composed of line segments to a similar curve
 * with fewer points. Parameter section will guarantee that the
 * algorithm splits the curve in at least 2^(sections) sections.
 * @param {[number]} points
 * @param {number} epsilon
 * @param {number} sections
 */
// eslint-disable-next-line import/prefer-default-export
export function simplifyRDP(
    points: number[],
    epsilon: number,
    sections: number
): number[] {
    if (points.length <= 4) {
        return points
    }

    let maxIndex = 0
    let maxDistance = 0
    let dist
    let filteredPoints

    if (sections > 0) {
        maxIndex = points.length / 2 + ((points.length / 2) % 2)
        maxDistance = epsilon
        sections -= 1
    }

    // find the point with the maximum distance
    for (let i = 2; i < points.length - 2; i += 2) {
        dist = perpendicularDistance({ x: points[i], y: points[i + 1] }, [
            { x: points[0], y: points[1] },
            { x: points[points.length - 2], y: points[points.length - 1] },
        ])
        if (dist > maxDistance) {
            maxIndex = i
            maxDistance = dist
        }
    }
    // if max distance is greater than epsilon, recursively simplify
    if (maxDistance >= epsilon) {
        const left = simplifyRDP(points.slice(0, maxIndex), epsilon, sections)
        if (maxIndex - 2 === 0) {
            const right = simplifyRDP(points.slice(maxIndex), epsilon, sections)
            filteredPoints = left.concat(right)
        } else {
            const right = simplifyRDP(
                points.slice(maxIndex - 2),
                epsilon,
                sections
            )
            filteredPoints = left.concat(right.slice(2))
        }
    } else {
        filteredPoints = [
            points[0],
            points[1],
            points[points.length - 2],
            points[points.length - 1],
        ]
    }

    return filteredPoints
}
