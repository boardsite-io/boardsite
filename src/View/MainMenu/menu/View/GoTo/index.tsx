import { HorizontalRule } from "components"
import { FormattedMessage } from "language"
import React from "react"
import { board } from "state/board"
import { SubMenuWrap } from "../../../index.styled"
import MenuItem from "../../../MenuItem"

const GoToMenu = () => {
    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.PreviousPage" />}
                onClick={() => board.jumpToPrevPage()}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.NextPage" />}
                onClick={() => board.jumpToNextPage()}
            />
            <HorizontalRule />
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.FirstPage" />}
                onClick={() => board.jumpToFirstPage()}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.LastPage" />}
                onClick={() => board.jumpToLastPage()}
            />
        </SubMenuWrap>
    )
}
export default GoToMenu
