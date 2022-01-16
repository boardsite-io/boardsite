import React from "react"
import { StyledDivider } from "./index.styled"

interface DrawerProps {
    color?: "primary" | "secondary"
}

const Divider: React.FC<DrawerProps> = ({ color = "primary" }) => (
    <StyledDivider $color={color} />
)

export default Divider
