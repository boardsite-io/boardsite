import React from "react"
import { useSelector } from "react-redux"
import {
    CgPushChevronLeft,
    CgChevronLeft,
    CgChevronRight,
    CgPushChevronRight,
} from "react-icons/cg"
import {
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
    JUMP_TO_FIRST_PAGE,
    JUMP_PAGE_WITH_INDEX,
} from "../../../redux/slice/viewcontrol"
import "../../../css/menucomponents/viewnavigation.css"
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
            <button
                type="button"
                id="icon-button"
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                <CgPushChevronLeft id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}>
                <CgChevronLeft id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                className="page-index"
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                {currPageIndex + 1}
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}>
                <CgChevronRight id="icon" />
            </button>
            <button type="button" id="icon-button" onClick={goToLastPage}>
                <CgPushChevronRight id="icon" />
            </button>
        </div>
    )
}
