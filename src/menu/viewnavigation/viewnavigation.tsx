import React from "react"
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
import store from "../../redux/store"
import { useCustomSelector } from "../../redux/hooks"
import {
    ViewNavIconButton,
    ViewNavPageIndexButton,
    ViewNavPageNum,
    ViewNavWrapper,
} from "./viewnavigation.styled"

const ViewNavigation: React.FC = () => {
    const currPageIndex = useCustomSelector(
        (state) => state.viewControl.currentPageIndex
    )
    const hideNavBar = useCustomSelector(
        (state) => state.viewControl.hideNavBar
    )
    const numPages = useCustomSelector(
        (state) => state.boardControl.pageRank.length
    )
    const goToLastPage = () => {
        store.dispatch(JUMP_PAGE_WITH_INDEX(numPages - 1))
    }

    return hideNavBar ? null : (
        <ViewNavWrapper>
            <ViewNavIconButton
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                <CgPushChevronUp id="icon" />
            </ViewNavIconButton>
            <ViewNavIconButton
                onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}>
                <CgChevronUp id="icon" />
            </ViewNavIconButton>
            <ViewNavPageIndexButton
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                <ViewNavPageNum>{currPageIndex + 1}</ViewNavPageNum>
                <hr />
                <ViewNavPageNum>{numPages}</ViewNavPageNum>
            </ViewNavPageIndexButton>
            <ViewNavIconButton
                onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}>
                <CgChevronDown id="icon" />
            </ViewNavIconButton>
            <ViewNavIconButton onClick={goToLastPage}>
                <CgPushChevronDown id="icon" />
            </ViewNavIconButton>
        </ViewNavWrapper>
    )
}

export default ViewNavigation
