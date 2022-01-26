import { FormattedMessage } from "language"
import React from "react"
import {
    JUMP_TO_FIRST_PAGE,
    JUMP_TO_LAST_PAGE,
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
} from "redux/board/board"
import store from "redux/store"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const GoToMenu = () => {
    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.FirstPage" />}
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.PreviousPage" />}
                onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.NextPage" />}
                onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo.LastPage" />}
                onClick={() => store.dispatch(JUMP_TO_LAST_PAGE())}
            />
        </SubMenuWrap>
    )
}
export default GoToMenu
