export function getHitbox(positions, pointSkipFactor, quadMinPixDist, padding) {
    // calculate hitboxes of all segments
    let xy1 = [Math.round(positions[0]), Math.round(positions[1])];
    let xy2;
    let hitbox = [];
    for (let i = 2 * pointSkipFactor; i < positions.length; i += 2 * pointSkipFactor) {
        xy2 = [Math.round(positions[i]), Math.round(positions[i + 1])];
        if ((Math.pow(xy2[0] - xy1[0], 2) + Math.pow(xy2[1] - xy1[1], 2)) < quadMinPixDist) { // move to next iter if points too close
            continue;
        }
        let hitboxPixels = calcPixelRow(xy1[0], xy1[1], xy2[0], xy2[1]);
        hitbox = hitbox.concat(hitboxPixels);
        xy1 = xy2;
    }
    // include last point of stroke that might have been left out in for loop
    xy2 = [Math.round(positions[positions.length - 2]), Math.round(positions[positions.length - 1])];
    if ((Math.pow(xy2[0] - xy1[0], 2) + Math.pow(xy2[1] - xy1[1], 2)) < quadMinPixDist) { // check if necessary
        let hitboxPixels = calcPixelRow(xy1[0], xy1[1], xy2[0], xy2[1]);
        hitbox = hitbox.concat(hitboxPixels);
    }

    if (padding) {
        // add one pixel on all sides of the hitbox to ensure proper functionality
        let tmp = {};
        for (let i = 0; i < hitbox.length; i++) {
            tmp[hitbox[i]] = 1;
        }
        for (let i = 0; i < hitbox.length; i++) {
            let x = hitbox[i][0];
            let y = hitbox[i][1];
            for (let j = -1; j <= 1; j++) {
                for (let k = -1; k <= 1; k++) {
                    if (j || k) {
                        let pos = [x + j, y + k];
                        if (!(pos in tmp)) {
                            tmp[pos] = 1;
                        }
                    }
                }
            }
        }
        hitbox = Object.keys(tmp).map(x => JSON.parse("[" + x + "]"));
    }

    return hitbox;
}

/**
 * Calculates the pixel positions that are touched by a line, 
 * defined by the connection between (x1,y1) and (x2,y2).
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 */
export function calcPixelRow(x1, y1, x2, y2) {
    // PixelReihen Algo: https://de.wikipedia.org/wiki/Rasterung_von_Linien

    if (x2 - x1 < 0) { // order so that x2 >= x1
        let cp = [x1, y1, x2, y2];
        x1 = cp[2];
        y1 = cp[3];
        x2 = cp[0];
        y2 = cp[1];
    }
    let xd = x2 - x1;
    let yd = y2 - y1;

    let hitbox = [];

    if (xd === 0) { // vertical line
        if (yd >= 0) {
            for (let i = 0; i <= yd; i++) {
                hitbox.push([x1, y1 + i]);
            }
        } else {
            for (let i = 0; i <= -yd; i++) {
                hitbox.push([x1, y2 + i]);
            }
        }
        return hitbox;
    } else if (yd === 0) { // horizontal line
        for (let i = 0; i <= xd; i++) {
            hitbox.push([x1 + i, y1]);
        }
        return hitbox;
    } else { // normal line
        let m_inv = xd / yd;
        let type = 0;
        if (1 > m_inv && m_inv > 0) {
            type = 1;
            let cp = [x1, y1, x2, y2, xd, yd];
            m_inv = 1 / m_inv;
            y1 = cp[0];
            x1 = cp[1];
            y2 = cp[2];
            x2 = cp[3];
            yd = cp[4];
            xd = cp[5];
        } else if (-1 <= m_inv && m_inv < 0) {
            type = 2;
            let cp = [x1, y1, x2, y2, xd, yd];
            m_inv = -1 / m_inv;
            x1 = cp[3]; // y2
            y1 = cp[0]; // x1
            x2 = cp[1]; // y1
            y2 = cp[2]; // x2
            yd = cp[4]; // xd
            xd = -cp[5]; // -yd
        } else if (m_inv < -1) {
            type = 3;
            let cp = [y1, y2, yd];
            y1 = cp[1];
            y2 = cp[0];
            yd = -yd;
            m_inv = -m_inv;
        }

        let rowStart = x1;
        for (let i = 0; i < yd; i++) {
            let rowEnd = Math.ceil(x1 + (0.5 + i) * m_inv - 1);
            for (let j = rowStart; j <= rowEnd; j++) {
                hitbox.push([j, y1 + i]);
            }
            rowStart = rowEnd + 1;
        }
        for (let j = rowStart; j <= x2; j++) {
            hitbox.push([j, y2]);
        }

        // CORRECT THE OUTPUT
        if (type === 1) {
            let hbox = [];
            for (let i = 0; i < hitbox.length; i++) {
                hbox.push([hitbox[i][0], hitbox[i][1]]);
            }
            return hbox;
        } else if (type === 2) {
            let pxRow = [];
            let len = hitbox.length;
            for (let i = 0; i < len; i++) {
                pxRow.push([hitbox[i][1], hitbox[len - i - 1][0]]);
            }
            return pxRow
        } else if (type === 3) {
            let pxRow = [];
            let len = hitbox.length;
            for (let i = 0; i < len; i++) {
                pxRow.push([hitbox[i][0], hitbox[len - i - 1][1]])
            }
            return pxRow;
        } else {
            return hitbox;
        }
    }
}