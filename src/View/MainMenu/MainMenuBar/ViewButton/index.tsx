import React, { memo } from "react"
import { useViewState } from "state/view"
import { MainMenuButton } from "../index.styled"

const ViewButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        const { scale } = useViewState()

        return (
            <MainMenuButton type="button" {...props}>
                {(scale * 100).toFixed(0)} %
            </MainMenuButton>
        )
    })
export default ViewButton
