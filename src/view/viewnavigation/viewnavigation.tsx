import { FormattedMessage } from "language"
import React from "react"
import store from "redux/store"
import {
    JUMP_TO_FIRST_PAGE,
    JUMP_TO_LAST_PAGE,
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
} from "redux/board/board"
import { useCustomSelector } from "hooks"
import { IconButton, ToolTip, Position } from "components"
import {
    CgPushChevronUp,
    CgChevronUp,
    CgChevronDown,
    CgPushChevronDown,
} from "react-icons/cg"
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
            <ToolTip
                text={<FormattedMessage id="Navigate.FirstPage" />}
                position={Position.Left}
            >
                <IconButton
                    onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}
                >
                    <CgPushChevronUp id="transitory-icon" />
                </IconButton>
            </ToolTip>
            <ToolTip
                text={<FormattedMessage id="Navigate.PreviousPage" />}
                position={Position.Left}
            >
                <IconButton onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}>
                    <CgChevronUp id="transitory-icon" />
                </IconButton>
            </ToolTip>
            <ToolTip
                text={<FormattedMessage id="Navigate.FirstPage" />}
                position={Position.Left}
            >
                <IconButtonPageIndex
                    onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}
                >
                    <PageIndex>{currentPageIndex + 1}</PageIndex>
                    <PageIndexHr />
                    <PageIndex>{pageRank.length}</PageIndex>
                </IconButtonPageIndex>
            </ToolTip>
            <ToolTip
                text={<FormattedMessage id="Navigate.NextPage" />}
                position={Position.Left}
            >
                <IconButton onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}>
                    <CgChevronDown id="transitory-icon" />
                </IconButton>
            </ToolTip>
            <ToolTip
                text={<FormattedMessage id="Navigate.LastPage" />}
                position={Position.Left}
            >
                <IconButton onClick={() => store.dispatch(JUMP_TO_LAST_PAGE())}>
                    <CgPushChevronDown id="transitory-icon" />
                </IconButton>
            </ToolTip>
        </ViewNavWrapper>
    ) : null
}

export default ViewNavigation
