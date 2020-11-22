const baseURL = "http://heat.port0.org:8000";
//const baseURL = "https://cors-anywhere.herokuapp.com/http://heat.port0.org:8000";

/**
 * Send data request to API.
 * @param {string} url 
 * @param {*} data 
 * @param {string} method 
 */
export function sendRequest(url, method, data={}) {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}${url}`, {
            method: method,
            body: JSON.stringify(data)
        }).then(
            (response) => response.json().then((data) => {
                if (!response.ok) {
                    // in case of error, api returns obj with 'error' key
                    reject({...data, status: response.status})
                } else {
                    resolve(data); // successful fetch
                }
            }).catch(() => resolve({}))
        ).catch(() => reject());
    });
}

/**
 * Connect to Websocket.
 * @param {string} sessionID 
 * @param {function} onMsgHandle 
 * @param {function} onConnectHandle 
 * @param {function} onCloseHandle 
 */
export function createWebsocket(sessionID, onMsgHandle, onConnectHandle, onCloseHandle) {
    return new Promise((resolve, reject) => {
        let socket = new WebSocket(`${baseURL.replace("http","ws")}/board/${sessionID}`);
        socket.onmessage = onMsgHandle;
        socket.onopen = onConnectHandle;
        socket.onclose = onCloseHandle;

        // check after 1 second if connection is ok
        setTimeout(() => {
            if (socket.readyState !== socket.OPEN) {
                reject({error: "can connect to websocket"})
            } else {
                resolve(socket)
            }
        }, 1000);
    });
}
/**
 * 
 * @param {{x: number, y: number}} boardDim 
 */
export function createBoardRequest(boardDim) {
    return sendRequest("/board/create", "POST", boardDim);
}

/**
 * Clears the board.
 * @param {string} sessionID
 */
export function clearBoard(sessionID) {
    return sendRequest(`/board/${sessionID}`, "PUT", {action: "clear"});
}
