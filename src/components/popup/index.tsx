import React, { MouseEventHandler, ReactNode } from "react"
import { PopupCover } from "./index.styled"

interface PopupProps {
    open: boolean
    onClose: MouseEventHandler<HTMLDivElement>
    children: ReactNode
}

const Popup: React.FC<PopupProps> = ({ open, onClose, children }) =>
    open ? (
        <>
            <PopupCover role="button" tabIndex={0} onClick={onClose} />
            {children}
        </>
    ) : null

export default Popup
