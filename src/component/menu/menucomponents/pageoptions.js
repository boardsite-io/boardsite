import React from "react"
import { MdAdd, MdClear, MdDelete } from "react-icons/md"
import {
    handleAddPageAt,
    handleClearPage,
    handleDeletePage,
} from "../../board/requestHandlers"
import "../../../css/menucomponents/pageoptions.css"

export default function PageOptions() {
    return (
        <div className="pageoptions-wrap">
            <button
                type="button"
                id="icon-button"
                onClick={() => handleAddPageAt()}>
                <MdAdd id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => handleClearPage()}>
                <MdClear id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => handleDeletePage()}>
                <MdDelete id="icon" />
            </button>
        </div>
    )
}
