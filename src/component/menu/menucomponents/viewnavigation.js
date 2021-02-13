import React from "react"
import { useSelector } from "react-redux"
import Tooltip from "@material-ui/core/Tooltip"
import {
    MdFirstPage,
    MdLastPage,
    MdChevronLeft,
    MdChevronRight,
} from "react-icons/md"
import {
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
    JUMP_TO_FIRST_PAGE,
    JUMP_PAGE_WITH_INDEX,
} from "../../../redux/slice/viewcontrol"
import "../../../css/viewnavigation.css"
import store from "../../../redux/store"

export default function ViewNavigation() {
    const currPageIndex = useSelector(
        (state) => state.viewControl.currentPageIndex
    )

    function goToLastPage() {
        const numPages = store.getState().boardControl.present.pageRank.length
        store.dispatch(JUMP_PAGE_WITH_INDEX(numPages - 1))
    }

    return (
        <div className="pn">
            <Tooltip
                id="tooltip"
                title="Page Up"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    className="pn-firstpage"
                    onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                    <MdFirstPage id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Page Up"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    className="pn-prevpage"
                    onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}>
                    <MdChevronLeft id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Return to First Page"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    className="pn-pageindex"
                    onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                    {currPageIndex + 1}
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Page Down"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    className="pn-nextpage"
                    onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}>
                    <MdChevronRight id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Page Up"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    className="pn-lastpage"
                    onClick={goToLastPage}>
                    <MdLastPage id="icon" />
                </button>
            </Tooltip>
        </div>
    )
}
