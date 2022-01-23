import { useCustomSelector } from "hooks"
import React, { memo } from "react"
import { ViewButtonWrap } from "./index.styled"

const ViewButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        const stageScale = useCustomSelector(
            (state) => state.board.stage.attrs.scaleX
        )
        return (
            <ViewButtonWrap type="button" {...props}>
                <span>{(stageScale * 100).toFixed(0)} %</span>
            </ViewButtonWrap>
        )
    })
export default ViewButton
