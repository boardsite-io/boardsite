import React, { ReactNode } from "react"
import { HoverTrigger, ToolTipBox, ToolTipText, Wrapper } from "./index.styled"
import { Position } from "./index.types"

interface TooltipProps {
    children: ReactNode
    text: JSX.Element
    position: Position
    deactivate?: boolean
}

const ToolTip: React.FC<TooltipProps> = ({
    children,
    text,
    position,
    deactivate = false,
}) => (
    <Wrapper>
        <HoverTrigger>
            {children}
            {!deactivate && (
                <ToolTipBox position={position} id="tooltip">
                    <ToolTipText>{text}</ToolTipText>
                </ToolTipBox>
            )}
        </HoverTrigger>
    </Wrapper>
)

export default ToolTip
