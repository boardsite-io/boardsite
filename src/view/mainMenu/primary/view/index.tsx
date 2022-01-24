import {
    ExpandIcon,
    ShrinkIcon,
    ZoomInIcon,
    ZoomOutIcon,
    ExpandableIcon,
    HorizontalRule,
} from "components"
import { FormattedMessage } from "language"
import React from "react"
import {
    FIT_WIDTH_TO_PAGE,
    RESET_VIEW,
    ZOOM_IN_CENTER,
    ZOOM_OUT_CENTER,
} from "redux/board/board"
import { MainSubMenuState } from "redux/menu/menu"
import store from "redux/store"
import { MainMenuWrap } from "../../index.styled"
import MenuItem from "../../menuItem"

const ViewMenu = () => {
    return (
        <MainMenuWrap>
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.GoTo" />}
                icon={<ExpandableIcon />}
                expandMenu={MainSubMenuState.GoTo}
            />
            <HorizontalRule />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.ResetView" />}
                icon={<ShrinkIcon />}
                onClick={() => store.dispatch(RESET_VIEW())}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.MaximizeView" />}
                icon={<ExpandIcon />}
                onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.ZoomIn" />}
                icon={<ZoomInIcon />}
                onClick={() => store.dispatch(ZOOM_IN_CENTER())}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.ZoomOut" />}
                icon={<ZoomOutIcon />}
                onClick={() => store.dispatch(ZOOM_OUT_CENTER())}
            />
        </MainMenuWrap>
    )
}
export default ViewMenu
