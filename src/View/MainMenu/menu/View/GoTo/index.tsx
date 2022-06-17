import { HorizontalRule } from "components"
import { FormattedMessage } from "language"
import React from "react"
import { view } from "state/view"
import { SubMenuWrap } from "View/MainMenu/index.styled"
import MenuItem from "View/MainMenu/MenuItem"

const GoToMenu = () => {
    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.PreviousPage" />}
                onClick={() => view.jumpToPrevPage()}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.NextPage" />}
                onClick={() => view.jumpToNextPage()}
            />
            <HorizontalRule />
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.FirstPage" />}
                onClick={() => view.jumpToFirstPage()}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.LastPage" />}
                onClick={() => view.jumpToLastPage()}
            />
        </SubMenuWrap>
    )
}
export default GoToMenu
