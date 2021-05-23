import {
    LIVESTROKE_PTS_OVERLAP,
    MAX_LIVESTROKE_PTS,
    RDP_EPSILON,
    RDP_FORCE_SECTIONS,
} from "../constants"
import { simplifyRDP } from "./simplify"

/**
 * Updates the livestroke points and splits the array accordingly
 * @param {[[number]]} points array of livestroke points
 * @param {{x: number, y: number}} point new point
 * @param {number} scale scale
 * @param {number} sample number of current samples
 */
// eslint-disable-next-line import/prefer-default-export
export function updateLivestroke(points, point, scale, sample) {
    const p = points[points.length - 1]
    if (p.length < MAX_LIVESTROKE_PTS) {
        if (
            sample === 0 // &&
            // hasMinDist([point.x, point.y], p, scale)
        ) {
            // append new point
            p.push(point.x, point.y)
        } else {
            // update the latest point
            p.splice(p.length - 2, 2, point.x, point.y)
        }
    } else {
        points[points.length - 1] = simplifyRDP(
            p,
            RDP_EPSILON / scale,
            RDP_FORCE_SECTIONS - 2
        )
        // create a new subarray
        // with the last point from the previous subarray as entry
        // in order to not get a gap in the stroke
        points.push(
            p
                .slice(p.length - LIVESTROKE_PTS_OVERLAP * 2, p.length)
                .concat([point.x, point.y])
        )
    }
}
