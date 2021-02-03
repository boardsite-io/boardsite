import {
    SYNC_ALL_PAGES,
    ADD_PAGE,
    CLEAR_PAGE,
    DELETE_PAGE,
    DELETE_ALL_PAGES,
    ADD_STROKE,
    ERASE_STROKE,
    UPDATE_STROKE,
} from "../redux/slice/boardcontrol"
// import { toolType } from "../../constants"
import store from "../redux/store"

const baseURL = "http://heat.port0.org:8000"
// const baseURL = "https://cors-anywhere.herokuapp.com/http://heat.port0.org:8000";

/**
 * Send data request to API.
 * @param {string} url
 * @param {*} data
 * @param {string} method
 */
function sendRequest(url, method, data = {}) {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}${url}`, {
            method,
            body: JSON.stringify(data),
        })
            .then((response) =>
                response
                    .json()
                    .then((data2) => {
                        if (!response.ok) {
                            // in case of error, api returns obj with 'error' key
                            reject(
                                new Error({ ...data2, status: response.status })
                            )
                        } else {
                            resolve(data2) // successful fetch
                        }
                    })
                    .catch(() => reject())
            )
            .catch(() => reject())
    })
}

/**
 * Connect to Websocket.
 * @param {string} sessionID
 * @param {function} onMsgHandle
 * @param {function} onConnectHandle
 * @param {function} onCloseHandle
 */
function createWebsocketPromise(
    sessionID,
    onMessageHandle,
    onConnectHandle,
    onCloseHandle
) {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(
            `${baseURL.replace("http", "ws")}/board/${sessionID}`
        )
        socket.onmessage = onMessageHandle
        socket.onopen = onConnectHandle
        socket.onclose = onCloseHandle

        // check after 1 second if connection is ok
        setTimeout(() => {
            if (socket.readyState !== socket.OPEN) {
                reject(new Error("can connect to websocket"))
            } else {
                resolve(socket)
            }
        }, 1000)
    })
}

export function createWebsocket(sessionId) {
    createWebsocketPromise(sessionId, onMessage, null, null)
        .then((socket) => {
            // wsRef.current = socket;
            // eslint-disable-next-line no-console
            console.log(sessionId, socket)
            navigator.clipboard.writeText(sessionId) // copy session ID to clipboard
        })
        // eslint-disable-next-line no-console
        .catch(() => console.log(`cannot connect websocket on '/${sessionId}'`))
}

export function createBoardRequest(boardDim) {
    return sendRequest("/board/create", "POST", boardDim)
}

function onMessage(payload) {
    const data = JSON.parse(payload.data)
    switch (data.messageType) {
        case "SYNC_ALL_PAGES":
            store.dispatch(SYNC_ALL_PAGES(data.pageRank, data.pageCollection))
            break
        case "ADD_PAGE": // Pen
            store.dispatch(ADD_PAGE())
            break
        case "CLEAR_PAGE": // Pen
            store.dispatch(CLEAR_PAGE())
            break
        case "DELETE_PAGE": // Pen
            store.dispatch(DELETE_PAGE())
            break
        case "DELETE_ALL_PAGES": // Pen
            store.dispatch(DELETE_ALL_PAGES())
            break
        case "ADD_STROKE": // Pen
            store.dispatch(ADD_STROKE())
            break
        case "ERASE_STROKE": // Eraser
            store.dispatch(ERASE_STROKE())
            break
        case "UPDATE_STROKE": // Eraser
            store.dispatch(UPDATE_STROKE())
            break
        default:
            // eslint-disable-next-line no-console
            console.log("dosmth", payload)
            break
    }
}

// // Handles messages from the websocket
// function onMsgHandle(data) {
//     const strokeObjectArray = JSON.parse(data.data);
//     if (strokeObjectArray.length === 0) {
//         actPage.deleteAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
//     }
//     else {
//         let pageId = strokeObjectArray[0].pageId;
//         let canvasRef = pageCollection[pageId];
//         proc.processStrokes(strokeObjectArray, "message", setStrokeCollection, setHitboxCollection,
//             setUndoStack, wsRef, canvasRef);
//     }
// }
