import React from "react"
import {
    CgPushChevronUp,
    CgChevronUp,
    CgChevronDown,
    CgPushChevronDown,
} from "react-icons/cg"
import { IconButton } from "components"
import {
    JUMP_PAGE_WITH_INDEX,
    JUMP_TO_FIRST_PAGE,
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
} from "redux/slice/boardcontrol"
import store from "../../redux/store"
import { useCustomSelector } from "../../redux/hooks"
import {
    ViewNavWrapper,
    PageIndex,
    PageIndexHr,
    IconButtonPageIndex,
} from "./viewnavigation.styled"

const ViewNavigation: React.FC = () => {
    const { currentPageIndex } = useCustomSelector(
        (state) => state.boardControl
    )
    const { hideNavBar } = useCustomSelector((state) => state.viewControl)
    const numPages = useCustomSelector(
        (state) => state.boardControl.pageRank.length
    )
    const goToLastPage = () => {
        store.dispatch(JUMP_PAGE_WITH_INDEX(numPages - 1))
    }

    return hideNavBar ? null : (
        <ViewNavWrapper>
            <IconButton onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                <CgPushChevronUp id="icon" />
            </IconButton>
            <IconButton onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}>
                <CgChevronUp id="icon" />
            </IconButton>
            <IconButtonPageIndex
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                <PageIndex>{currentPageIndex + 1}</PageIndex>
                <PageIndexHr />
                <PageIndex>{numPages}</PageIndex>
            </IconButtonPageIndex>
            <IconButton onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}>
                <CgChevronDown id="icon" />
            </IconButton>
            <IconButton onClick={goToLastPage}>
                <CgPushChevronDown id="icon" />
            </IconButton>
        </ViewNavWrapper>
    )
}

export default ViewNavigation
