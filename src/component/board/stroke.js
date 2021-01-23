import store from "../../redux/store.js"
import { actAddStroke, actEraseStroke } from "../../redux/slice/boardcontrol.js"
import {
    actStartLiveStroke,
    actUpdateLiveStrokePos,
    actEndLiveStroke,
} from "../../redux/slice/drawcontrol.js"
import { Line } from "react-konva"
import { type } from "../../constants.js"
// import * as constant from '../constants.js';

/**
 * Super component implementing all stroke types and their visualization in the canvas
 * @param {{stroke: {}}} props
 */
export function StrokeShape(props) {
    let shape
    switch (props.stroke.type) {
        case type.PEN:
            shape = (
                <Line
                    points={props.stroke.points}
                    stroke={props.stroke.style.color}
                    strokeWidth={props.stroke.style.width}
                    tension={0.5}
                    lineCap="round"
                    onMouseEnter={(e) =>
                        handleStrokeMouseEnter(e, props.stroke)
                    }
                    draggable={props.isDraggable}
                />
            )
            break
        default:
            shape = <></>
    }

    return shape
}

function handleStrokeMouseEnter(e, stroke) {
    const isMouseDown = store.getState().drawControl.isMouseDown
    if (stroke.id === undefined || !isMouseDown) {
        return
    }

    if (
        store.getState().drawControl.liveStroke.type === type.ERASER ||
        e.evt.buttons === 2
    ) {
        store.dispatch(actEraseStroke(stroke))
    }
}

/**
 * Start the current stroke when mouse is pressed down
 * @param {*} position
 */
export function startLiveStroke(position, pageId) {
    store.dispatch(
        actStartLiveStroke({
            page_id: pageId,
            points: [position.x, position.y],
        })
    )
}

/**
 * Update the live stroke when position is moved in the canvas
 * @param {*} position
 */
export function moveLiveStroke(position) {
    store.dispatch(
        actUpdateLiveStrokePos([position.x, position.y])
    )
    //console.log(store.getState().drawControl.liveStroke)
}

/**
 * Generate API serialized stroke object, draw & save it to redux store
 * @param {*} pageId
 */
export async function registerLiveStroke(position) {
    let liveStroke = store.getState().drawControl.liveStroke
    // empty livestrokes e.g. rightmouse eraser
    if (liveStroke.points[liveStroke.page_id] === undefined) {
        return
    }
    if (liveStroke.type === type.ERASER) {
        return
    }

    moveLiveStroke(position)

    liveStroke = {
        ...liveStroke,
        id:
            Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 4) + Date.now().toString(36).substr(4),
        points: liveStroke.points[liveStroke.page_id],
    }

    // add stroke to collection
    store.dispatch(actAddStroke(liveStroke))

    // clear livestroke
    store.dispatch(actEndLiveStroke())
}
