import {
    Divider,
    ExpandIcon,
    ShrinkIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from "components"
import { FormattedMessage } from "language"
import React from "react"
import {
    FIT_WIDTH_TO_PAGE,
    JUMP_TO_FIRST_PAGE,
    JUMP_TO_LAST_PAGE,
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
    RESET_VIEW,
    ZOOM_IN_CENTER,
    ZOOM_OUT_CENTER,
} from "redux/board/board"
import store from "redux/store"
import { MainMenuWrap } from "../index.styled"
import MenuItem from "../menuItem"

const ViewMenu = () => {
    return (
        <MainMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.View.ResetView" />}
                icon={<ShrinkIcon />}
                onClick={() => store.dispatch(RESET_VIEW())}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.MaximizeView" />}
                icon={<ExpandIcon />}
                onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.ZoomIn" />}
                icon={<ZoomInIcon />}
                onClick={() => store.dispatch(ZOOM_IN_CENTER())}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.ZoomOut" />}
                icon={<ZoomOutIcon />}
                onClick={() => store.dispatch(ZOOM_OUT_CENTER())}
            />
            <Divider />
            <MenuItem
                text={<FormattedMessage id="Menu.View.FirstPage" />}
                onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.PreviousPage" />}
                onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.NextPage" />}
                onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.LastPage" />}
                onClick={() => store.dispatch(JUMP_TO_LAST_PAGE())}
            />
        </MainMenuWrap>
    )
}
export default ViewMenu
