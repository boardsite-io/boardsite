import React, { MouseEventHandler, ReactNode } from "react"
import { PopupCover, PopupWrap } from "./popup.styled"

interface PopupProps {
    open: boolean
    onClose: MouseEventHandler<HTMLDivElement>
    children: ReactNode
}

const Popup: React.FC<PopupProps> = ({ open, onClose, children }: PopupProps) =>
    open ? (
        <PopupWrap>
            <PopupCover role="button" tabIndex={0} onClick={onClose} />
            {children}
        </PopupWrap>
    ) : null

export default Popup
