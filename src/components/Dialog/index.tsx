import React, { MouseEventHandler, ReactNode } from "react"
import { DialogBox, DialogBackground } from "./index.styled"

export interface DialogProps {
    open: boolean
    onClose: MouseEventHandler<HTMLDivElement>
    children: ReactNode
    className?: string
}

const Dialog: React.FC<DialogProps> = ({
    className,
    open,
    onClose,
    children,
}) => (
    <>
        <DialogBackground open={open} onClick={onClose} />
        <DialogBox className={className} open={open}>
            {children}
        </DialogBox>
    </>
)

export default Dialog
