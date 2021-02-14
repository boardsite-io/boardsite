import React from "react"
import { useSelector } from "react-redux"
import { MdAdd, MdClear, MdDelete, MdDeleteForever } from "react-icons/md"
import {
    handleAddPage,
    handleAddPageAt,
    handleClearPage,
    handleDeletePage,
    handleDeleteAllPages,
} from "../board/requestHandlers"
import SessionDialog from "./menucomponents/sessiondialog"

export default function Homebar() {
    const currPageIndex = useSelector(
        (state) => state.viewControl.currentPageIndex
    )

    return (
        <div className="homebar">
            <SessionDialog />
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
            <button
                type="button"
                id="icon-button"
                onClick={handleDeleteAllPages}>
                <MdDeleteForever id="icon" />
            </button>
            <button type="button" id="icon-button" onClick={handleAddPage}>
                <MdAdd id="icon" />
            </button>
        </div>
    )
}
