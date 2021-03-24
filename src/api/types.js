// api
export const API_URL = `http${
    process.env.REACT_APP_B_SSL === "1" ? "s" : ""
}://${process.env.REACT_APP_B_API_HOSTNAME}:${process.env.REACT_APP_B_API_PORT}`

export const MessageType = {
    Stroke: "stroke",
    UserConnected: "userconn",
    UserDisconnected: "userdisc",
    PageSync: "pagesync",
    PageClear: "pageclear",
}

export function newMessage(type = "", sender = "", content = {}) {
    if (type === "") {
        throw Error("message with empty type not allowed")
    }
    return {
        type,
        sender,
        content,
    }
}
