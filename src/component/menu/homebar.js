import React from "react"
import { useSelector } from "react-redux"
import {
    MdAdd,
    MdClear,
    MdDelete,
    MdGroupAdd,
    MdDeleteForever,
} from "react-icons/md"
import Tooltip from "@material-ui/core/Tooltip"
import {
    handleAddPage,
    handleAddPageAt,
    handleClearPage,
    handleDeletePage,
    handleDeleteAllPages,
} from "../board/requestHandlers"

export default function Homebar(props) {
    const currPageIndex = useSelector(
        (state) => state.viewControl.currentPageIndex
    )

    return (
        <div className="homebar">
            <Tooltip
                id="tooltip"
                title="join or create session"
                TransitionProps={{ timeout: 0 }}
                placement="right">
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => props.setOpenSessionDialog(true)}>
                    <MdGroupAdd id="icon" />
                </button>
            </Tooltip>
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
            <Tooltip
                id="tooltip"
                title="delete all pages"
                TransitionProps={{ timeout: 0 }}
                placement="right">
                <button
                    type="button"
                    id="icon-button"
                    onClick={handleDeleteAllPages}>
                    <MdDeleteForever id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="append page"
                TransitionProps={{ timeout: 0 }}
                placement="right">
                <button type="button" id="icon-button" onClick={handleAddPage}>
                    <MdAdd id="icon" />
                </button>
            </Tooltip>
        </div>
    )
}
