import React from "react"
import { useSelector } from "react-redux"
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
                className="pn-firstpage"
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                <MdFirstPage id="icon" />
            </button>
            <button
                type="button"
                className="pn-prevpage"
                onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}>
                <MdChevronLeft id="icon" />
            </button>
            <button
                type="button"
                className="pn-pageindex"
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                {currPageIndex + 1}
            </button>
            <button
                type="button"
                className="pn-nextpage"
                onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}>
                <MdChevronRight id="icon" />
            </button>
            <button
                type="button"
                className="pn-lastpage"
                onClick={goToLastPage}>
                <MdLastPage id="icon" />
            </button>
        </div>
    )
}
