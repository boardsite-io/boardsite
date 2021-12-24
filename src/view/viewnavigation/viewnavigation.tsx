import React from "react"
import {
    CgPushChevronUp,
    CgChevronUp,
    CgChevronDown,
    CgPushChevronDown,
} from "react-icons/cg"
import { IconButton } from "components"
import {
    JUMP_TO_FIRST_PAGE,
    JUMP_TO_LAST_PAGE,
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
} from "redux/board/board"
import store from "redux/store"
import { useCustomSelector } from "hooks"
import {
    ViewNavWrapper,
    PageIndex,
    PageIndexHr,
    IconButtonPageIndex,
} from "./viewnavigation.styled"

const ViewNavigation: React.FC = () => {
    const pageRank = useCustomSelector((state) => state.board.pageRank)
    const currentPageIndex = useCustomSelector(
        (state) => state.board.currentPageIndex
    )
    const hideNavBar = useCustomSelector(
        (state) => state.board.stage.hideNavBar
    )

    return !hideNavBar && pageRank.length > 0 ? (
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
                <PageIndex>{pageRank.length}</PageIndex>
            </IconButtonPageIndex>
            <IconButton onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}>
                <CgChevronDown id="icon" />
            </IconButton>
            <IconButton onClick={() => store.dispatch(JUMP_TO_LAST_PAGE())}>
                <CgPushChevronDown id="icon" />
            </IconButton>
        </ViewNavWrapper>
    ) : null
}

export default ViewNavigation
