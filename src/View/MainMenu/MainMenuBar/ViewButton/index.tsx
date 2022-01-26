import { useCustomSelector } from "hooks"
import React, { memo } from "react"
import { MainMenuButton } from "../index.styled"

const ViewButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        const stageScale = useCustomSelector(
            (state) => state.board.stage.attrs.scaleX
        )
        return (
            <MainMenuButton type="button" {...props}>
                {(stageScale * 100).toFixed(0)} %
            </MainMenuButton>
        )
    })
export default ViewButton
