import React from "react"
import { useSelector } from "react-redux"
import Tooltip from "@material-ui/core/Tooltip"
import { MdExpandLess, MdExpandMore } from "react-icons/md"
import {
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
    JUMP_TO_FIRST_PAGE,
} from "../../redux/slice/viewcontrol"
import "../../css/pagenavigator.css"
import store from "../../redux/store"

export default function PageNav() {
    const currPageIndex = useSelector(
        (state) => state.viewControl.currentPageIndex
    )

    return (
        <div className="page-nav">
            <Tooltip
                id="tooltip"
                title="Page Up"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    className="button-pagenav-top"
                    onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}>
                    <MdExpandLess id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Return to First Page"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    className="button-pagenav"
                    onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                    {currPageIndex}
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Page Down"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    className="button-pagenav-bottom"
                    onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}>
                    <MdExpandMore id="icon" />
                </button>
            </Tooltip>
        </div>
    )
}
