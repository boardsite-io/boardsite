import React, { useState } from "react"
import { FormattedMessage } from "language"
import {
    ExpandIcon,
    ShrinkIcon,
    ZoomInIcon,
    ZoomOutIcon,
    HorizontalRule,
    ExpandableIcon,
} from "components"
import { view } from "state/view"
import { CSSTransition } from "react-transition-group"
import { cssTransition } from "View/MainMenu/cssTransition"
import { MainMenuWrap } from "View/MainMenu/index.styled"
import MenuItem from "View/MainMenu/MenuItem"
import GoToMenu from "./GoTo"

enum SubMenu {
    Closed,
    GoTo,
}

const ViewMenu = () => {
    const [subMenu, setSubMenu] = useState<SubMenu>(SubMenu.Closed)

    return (
        <MainMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.View.GoTo" />}
                expandMenu={() => setSubMenu(SubMenu.GoTo)}
                icon={<ExpandableIcon />}
            >
                <CSSTransition in={subMenu === SubMenu.GoTo} {...cssTransition}>
                    <GoToMenu />
                </CSSTransition>
            </MenuItem>
            <HorizontalRule />
            <MenuItem
                text={<FormattedMessage id="Menu.View.ResetView" />}
                icon={<ShrinkIcon />}
                onClick={() => view.resetViewScale()}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.MaximizeView" />}
                icon={<ExpandIcon />}
                onClick={() => view.fitToPage()}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.ZoomIn" />}
                icon={<ZoomInIcon />}
                onClick={() => view.zoomCenter(true)}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.View.ZoomOut" />}
                icon={<ZoomOutIcon />}
                onClick={() => view.zoomCenter(false)}
            />
        </MainMenuWrap>
    )
}
export default ViewMenu
