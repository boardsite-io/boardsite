import React, { MouseEventHandler, ReactNode } from "react"
import { DrawerBox, DrawerBackground } from "./index.styled"

interface DrawerProps {
    position?: "left" | "right"
    open: boolean
    onClose: MouseEventHandler<HTMLDivElement>
    children: ReactNode
    className?: string
}

const Drawer: React.FC<DrawerProps> = ({
    position = "left",
    open,
    onClose,
    children,
    className,
}) => (
    <>
        <DrawerBackground open={open} onClick={onClose} />
        <DrawerBox className={className} open={open} position={position}>
            {children}
        </DrawerBox>
    </>
)

export default Drawer
