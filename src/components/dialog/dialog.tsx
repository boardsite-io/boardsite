import React, { MouseEventHandler, ReactNode } from "react"
import { DialogBox, DialogBackground } from "./dialog.styled"

interface DialogProps {
    open: boolean
    onClose: MouseEventHandler<HTMLDivElement>
    children: ReactNode
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children }) => (
    <>
        <DialogBackground open={open} onClick={onClose} />
        <DialogBox open={open}>{children}</DialogBox>
    </>
)

export default Dialog
