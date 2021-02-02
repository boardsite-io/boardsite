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
            console.log(sessionId, socket)
            navigator.clipboard.writeText(sessionId) // copy session ID to clipboard
        })
        .catch(() => console.log(`cannot connect websocket on '/${sessionId}'`))
}

export function createBoardRequest(boardDim) {
    return sendRequest("/board/create", "POST", boardDim)
}

function onMessage(data) {
    console.log("dosmth", data)
    // const strokeObjectArray = JSON.parse(data.data)
    // switch (messageType) {
    //     case "p": // Pen
    //         store.dispatch(SET_TYPE(toolType.PEN))
    //         break
    //     case "1": // Pen
    //         store.dispatch(SET_TYPE(toolType.PEN))
    //         break
    //     case "e": // Eraser
    //         store.dispatch(SET_TYPE(toolType.ERASER))
    //         break
    //     case "2": // Eraser
    //         store.dispatch(SET_TYPE(toolType.ERASER))
    //         break
    //     default:
    //         break
    // }
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
