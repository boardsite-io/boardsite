import React from "react"
import { FormattedMessage } from "language"
import {
    ExpandIcon,
    ShrinkIcon,
    ZoomInIcon,
    ZoomOutIcon,
    HorizontalRule,
} from "components"
import { view } from "state/view"
import { MainSubMenuState } from "state/menu/state/index.types"
import { MainMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const ViewMenu = () => {
    return (
        <MainMenuWrap>
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.GoTo" />}
                expandMenu={MainSubMenuState.GoTo}
            />
            <HorizontalRule />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.ResetView" />}
                icon={<ShrinkIcon />}
                onClick={() => view.resetViewScale()}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.MaximizeView" />}
                icon={<ExpandIcon />}
                onClick={() => view.fitToPage()}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.ZoomIn" />}
                icon={<ZoomInIcon />}
                onClick={() => view.zoomCenter(true)}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.ZoomOut" />}
                icon={<ZoomOutIcon />}
                onClick={() => view.zoomCenter(false)}
            />
        </MainMenuWrap>
    )
}
export default ViewMenu
