import React, { memo } from "react"
import { useGState } from "state"
import { MainMenuButton } from "../index.styled"

const ViewButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        const { scale } = useGState("ViewTransform").view.viewTransform

        return (
            <MainMenuButton
                aria-label="Open view menu"
                type="button"
                {...props}
            >
                {(scale * 100).toFixed(0)} %
            </MainMenuButton>
        )
    })
export default ViewButton
