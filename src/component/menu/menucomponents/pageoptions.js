import React, { useState } from "react"
import {
    BsFileMinus,
    BsFileRuled,
    BsTrash,
    BsFileArrowDown,
    BsFileArrowUp,
    BsFileDiff,
} from "react-icons/bs"
import {
    handleAddPageOver,
    handleAddPageUnder,
    handleClearPage,
    handleDeleteAllPages,
    handleDeletePage,
} from "../../board/request_handlers"
import "../../../css/menucomponents/pageoptions.css"

export default function PageOptions() {
    const [open, setOpen] = useState(false)

    return (
        <div className="pageoptions-wrap">
            <button
                type="button"
                id="icon-button"
                onClick={() => setOpen(true)}>
                <BsFileDiff id="icon" />
            </button>
            {
                // Palette Popup
                open ? (
                    <div className="popup">
                        <div
                            role="button"
                            tabIndex="0"
                            className="cover"
                            onClick={() => setOpen(false)}
                            onKeyPress={() => {}}
                        />
                        <div className="pageoptions">
                            <button
                                type="button"
                                id="icon-button"
                                onClick={handleAddPageOver}>
                                <BsFileArrowUp id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={handleAddPageUnder}>
                                <BsFileArrowDown id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => handleDeletePage()}>
                                <BsFileMinus id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => handleClearPage()}>
                                <BsFileRuled id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={handleDeleteAllPages}>
                                <BsTrash id="icon" />
                            </button>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}
