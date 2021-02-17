import React from "react"
import { useSelector } from "react-redux"
import "../../css/sessioninfo.css"

export default function SessionInfo() {
    const userInfo = useSelector((state) => state.webControl.connectedUsers)
    return (
        <div className="session-info">
            {Object.keys(userInfo).map((id) => {
                const { alias, color, userId } = userInfo[id]
                return (
                    <div key={userId} className="user-info">
                        <div
                            className="user-color"
                            style={{ backgroundColor: color }}
                        />
                        <div className="user-alias">{alias}</div>
                    </div>
                )
            })}
        </div>
    )
}
