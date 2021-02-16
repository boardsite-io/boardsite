import React from "react"
import "../../css/sessioninfo.css"

export default function SessionInfo() {
    const info = [
        { alias: "Gucciboi123", color: "#0f0", userid: "123uhih12" },
        { alias: "hackermens1337", color: "#ff0", userid: "bquadratis24" },
        { alias: "Troll22", color: "#074", userid: "xdddddd" },
        { alias: "sheeshkebab", color: "#f0f", userid: "122222h12" },
        { alias: "TheLegend27", color: "#fff", userid: "1567hzj12" },
    ]
    return (
        <div className="session-info">
            {/* <h1>Session Info:</h1> */}
            {info.map((user) => (
                <div key={user.userid} className="user-info">
                    <div
                        className="user-color"
                        style={{ backgroundColor: user.color }}
                    />
                    <div className="user-alias">{user.alias}</div>
                </div>
            ))}
        </div>
    )
}
