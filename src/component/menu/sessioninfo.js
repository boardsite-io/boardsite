import React from "react"
import "../../css/sessioninfo.css"

export default function SessionInfo() {
    const userInfo = {
        "123uhih12": {
            alias: "Gucciboi123",
            color: "#0f0",
            userId: "123uhih12",
        },
        "1bquadratis24": {
            alias: "hackermens1337",
            color: "#ff0",
            userId: "1bquadratis24",
        },
        "3xdddddd": { alias: "Troll22", color: "#074", userId: "3xdddddd" },
        "122222h12": {
            alias: "sheeshkebab",
            color: "#f0f",
            userId: "122222h12",
        },
        "1567hzj12": {
            alias: "TheLegend27",
            color: "#fff",
            userId: "1567hzj12",
        },
    }
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
