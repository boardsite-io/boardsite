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
    INITIAL_VIEW,
} from "redux/board/board"
import store from "redux/store"
import { useCustomSelector } from "hooks"
import {
    ViewNavWrapper,
    PageIndex,
    PageIndexHr,
    IconButtonPageIndex,
} from "./viewnavigation.styled"

const firstPage = () => {
    store.dispatch(JUMP_TO_FIRST_PAGE())
    store.dispatch(INITIAL_VIEW())
}
const previousPage = () => {
    store.dispatch(JUMP_TO_PREV_PAGE())
    store.dispatch(INITIAL_VIEW())
}
const nextPage = () => {
    store.dispatch(JUMP_TO_NEXT_PAGE())
    store.dispatch(INITIAL_VIEW())
}
const lastPage = () => {
    store.dispatch(JUMP_TO_LAST_PAGE())
    store.dispatch(INITIAL_VIEW())
}

const ViewNavigation: React.FC = () => {
    const { currentPageIndex, pageRank } = useCustomSelector(
        (state) => state.board
    )
    const { hideNavBar } = useCustomSelector((state) => state.board.view)

    return hideNavBar ? null : (
        <ViewNavWrapper>
            <IconButton onClick={firstPage}>
                <CgPushChevronUp id="icon" />
            </IconButton>
            <IconButton onClick={previousPage}>
                <CgChevronUp id="icon" />
            </IconButton>
            <IconButtonPageIndex onClick={firstPage}>
                <PageIndex>{currentPageIndex + 1}</PageIndex>
                <PageIndexHr />
                <PageIndex>{pageRank.length}</PageIndex>
            </IconButtonPageIndex>
            <IconButton onClick={nextPage}>
                <CgChevronDown id="icon" />
            </IconButton>
            <IconButton onClick={lastPage}>
                <CgPushChevronDown id="icon" />
            </IconButton>
        </ViewNavWrapper>
    )
}

export default ViewNavigation
