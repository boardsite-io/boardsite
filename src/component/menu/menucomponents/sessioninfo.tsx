import React from "react"
import "../../../css/sessioninfo.css"
import { useAppSelector } from "../../../types"

export default function SessionInfo() {
    const userInfo = useAppSelector((state) => state.webControl.connectedUsers)
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
