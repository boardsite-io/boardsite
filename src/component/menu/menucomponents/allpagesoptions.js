import React from "react"
import { MdDeleteForever } from "react-icons/md"
import { VscNewFile } from "react-icons/vsc"

import {
    handleAddPage,
    handleDeleteAllPages,
} from "../../board/requestHandlers"
import "../../../css/menucomponents/pageoptions.css"

export default function AllPagesOptions() {
    return (
        <div className="pageoptions-wrap">
            <button
                type="button"
                id="icon-button"
                onClick={handleDeleteAllPages}>
                <MdDeleteForever id="icon" />
            </button>
            <button type="button" id="icon-button" onClick={handleAddPage}>
                <VscNewFile id="icon" />
            </button>
        </div>
    )
}
