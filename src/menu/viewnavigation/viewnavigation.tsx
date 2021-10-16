import React from "react"
import {
    CgPushChevronUp,
    CgChevronUp,
    CgChevronDown,
    CgPushChevronDown,
} from "react-icons/cg"
import { IconButton } from "components"
import store from "redux/store"
import { useCustomSelector } from "redux/hooks"
import {
    ViewNavWrapper,
    PageIndex,
    PageIndexHr,
    IconButtonPageIndex,
} from "./viewnavigation.styled"

const firstPage = () => {
    store.dispatch({
        type: "JUMP_TO_FIRST_PAGE",
        payload: undefined,
    })
    store.dispatch({
        type: "INITIAL_VIEW",
        payload: undefined,
    })
}
const previousPage = () => {
    store.dispatch({
        type: "JUMP_TO_PREV_PAGE",
        payload: undefined,
    })
    store.dispatch({
        type: "INITIAL_VIEW",
        payload: undefined,
    })
}
const nextPage = () => {
    store.dispatch({
        type: "JUMP_TO_NEXT_PAGE",
        payload: undefined,
    })
    store.dispatch({
        type: "INITIAL_VIEW",
        payload: undefined,
    })
}
const lastPage = () => {
    store.dispatch({
        type: "JUMP_TO_LAST_PAGE",
        payload: undefined,
    })
    store.dispatch({
        type: "INITIAL_VIEW",
        payload: undefined,
    })
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
