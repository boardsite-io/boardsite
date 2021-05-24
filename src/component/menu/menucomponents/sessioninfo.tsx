import React from "react"
import "../../../css/sessioninfo.css"
import { useCustomSelector } from "../../../redux/hooks"

const SessionInfo: React.FC = () => {
    const userInfo = useCustomSelector(
        (state) => state.webControl.connectedUsers
    )
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

export default SessionInfo
