import React, { MouseEventHandler, ReactNode } from "react"
import { DialogBox, DialogBackground } from "./dialog.styled"

interface DialogProps {
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
