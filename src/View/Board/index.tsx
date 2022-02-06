import React, { memo } from "react"
import RenderNG from "./RenderNG"
import Observer from "./Observer"

const Board: React.FC = memo(() => {
    return (
        <Observer>
            <RenderNG />
        </Observer>
    )
})
export default Board
