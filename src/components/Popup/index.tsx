import React, { MouseEventHandler, ReactNode } from "react"
import { PopupCover } from "./index.styled"

interface PopupProps {
    open: boolean
    onClose: MouseEventHandler<HTMLButtonElement>
    children: ReactNode
}

const Popup: React.FC<PopupProps> = ({ open, onClose, children }) =>
    open ? (
        <>
            <PopupCover onClick={onClose} />
            {children}
        </>
    ) : null

export default Popup
