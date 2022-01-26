import React from "react"
import IconButton, { IconButtonProps } from "../IconButton"
import { ToolInfo, ToolButtonWrap } from "./index.styled"

interface ToolButtonProps extends IconButtonProps {
    toolColor: string
    toolWidth: number
}

const ToolButton: React.FC<ToolButtonProps> = ({
    toolWidth,
    toolColor,
    ...props
}) => (
    <ToolButtonWrap>
        <IconButton {...props} />
        <ToolInfo $toolColor={toolColor}>{toolWidth}</ToolInfo>
    </ToolButtonWrap>
)

export default ToolButton
