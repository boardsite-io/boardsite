import React, { MouseEventHandler, ReactNode } from "react"
import { DrawerBox, DrawerBackground } from "./drawer.styled"

interface DrawerProps {
    position?: "left" | "right"
    open: boolean
    onClose: MouseEventHandler<HTMLDivElement>
    children: ReactNode
}

const Drawer: React.FC<DrawerProps> = ({
    position = "left",
    open,
    onClose,
    children,
}) =>
    open ? (
        <>
            <DrawerBackground onClick={onClose} />
            <DrawerBox position={position}>{children}</DrawerBox>
        </>
    ) : null

export default Drawer
