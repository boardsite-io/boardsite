import React, { ReactNode } from "react"
import { HoverTrigger, ToolTipBox, ToolTipText, Wrapper } from "./index.styled"
import { Position } from "./index.types"

interface TooltipProps {
    children: ReactNode
    text: JSX.Element
    position: Position
}

const ToolTip: React.FC<TooltipProps> = ({ children, text, position }) => (
    <Wrapper>
        <HoverTrigger>
            {children}
            <ToolTipBox position={position} id="tooltip">
                <ToolTipText>{text}</ToolTipText>
            </ToolTipBox>
        </HoverTrigger>
    </Wrapper>
)

export default ToolTip
