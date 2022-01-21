import { ExpandIcon, ShrinkIcon, ZoomInIcon, ZoomOutIcon } from "components"
import { FormattedMessage } from "language"
import React from "react"
import {
    FIT_WIDTH_TO_PAGE,
    RESET_VIEW,
    ZOOM_IN_CENTER,
    ZOOM_OUT_CENTER,
} from "redux/board/board"
import store from "redux/store"
import { SubMenu } from "../index.styled"
import MenuItem from "../menuItem"

const ViewMenu = () => {
    return (
        <SubMenu>
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.View.ResetView" />}
                icon={<ShrinkIcon />}
                onClick={() => store.dispatch(RESET_VIEW())}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.View.MaximizeView" />}
                icon={<ExpandIcon />}
                onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.View.ZoomIn" />}
                icon={<ZoomInIcon />}
                onClick={() => store.dispatch(ZOOM_IN_CENTER())}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.View.ZoomOut" />}
                icon={<ZoomOutIcon />}
                onClick={() => store.dispatch(ZOOM_OUT_CENTER())}
            />
        </SubMenu>
    )
}
export default ViewMenu
