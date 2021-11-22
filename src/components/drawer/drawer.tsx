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
}) => (
    <>
        <DrawerBackground open={open} onClick={onClose} />
        <DrawerBox open={open} position={position}>
            {children}
        </DrawerBox>
    </>
)

export default Drawer
