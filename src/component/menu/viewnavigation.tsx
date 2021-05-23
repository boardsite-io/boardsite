import React from "react"
import { useSelector } from "react-redux"
import {
    CgPushChevronUp,
    CgChevronUp,
    CgChevronDown,
    CgPushChevronDown,
} from "react-icons/cg"
import {
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
    JUMP_TO_FIRST_PAGE,
    JUMP_PAGE_WITH_INDEX,
} from "../../redux/slice/viewcontrol"
import "../../css/menucomponents/viewnavigation.css"
import store from "../../redux/store"

export default function ViewNavigation() {
    const currPageIndex = useSelector(
        (state) => state.viewControl.currentPageIndex
    )

    const hideNavBar = useSelector((state) => state.viewControl.hideNavBar)
    const numPages = useSelector((state) => state.boardControl.pageRank.length)

    function goToLastPage() {
        store.dispatch(JUMP_PAGE_WITH_INDEX(numPages - 1))
    }

    return hideNavBar ? null : (
        <div className="view-nav">
            <button
                type="button"
                id="icon-button-nav"
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                <CgPushChevronUp id="icon-nav" />
            </button>
            <button
                type="button"
                id="icon-button-nav"
                onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}>
                <CgChevronUp id="icon-nav" />
            </button>
            <button
                type="button"
                className="icon-button-page-index"
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                <p className="page-num">{currPageIndex + 1}</p>
                <hr />
                <p className="page-num">{numPages}</p>
            </button>
            <button
                type="button"
                id="icon-button-nav"
                onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}>
                <CgChevronDown id="icon-nav" />
            </button>
            <button type="button" id="icon-button-nav" onClick={goToLastPage}>
                <CgPushChevronDown id="icon-nav" />
            </button>
        </div>
    )
}
