import React from "react"
import { useSelector } from "react-redux"
import { MdAdd, MdClear, MdDelete } from "react-icons/md"
import {
    handleAddPageAt,
    handleClearPage,
    handleDeletePage,
} from "../../board/requestHandlers"
import "../../../css/menucomponents/pageoptions.css"

export default function PageOptions() {
    const currPageIndex = useSelector(
        (state) => state.viewControl.currentPageIndex
    )

    return (
        <div className="pageoptions-wrap">
            <button
                type="button"
                id="icon-button"
                onClick={() => handleAddPageAt(currPageIndex)}>
                <MdAdd id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => handleClearPage(currPageIndex)}>
                <MdClear id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => handleDeletePage(currPageIndex)}>
                <MdDelete id="icon" />
            </button>
        </div>
    )
}
