import React from "react"
import { useSelector } from "react-redux"
import "../../css/sessioninfo.css"

export default function SessionInfo() {
    const userInfo = useSelector((state) => state.webControl.connectedUsers)
    console.log(userInfo)
    return (
        <div className="session-info">
            {Object.keys(userInfo).map((userId) => {
                const { alias, color, id } = userInfo[userId]
                return (
                    <div key={id} className="user-info">
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
