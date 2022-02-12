import React from "react"
import { FormattedMessage } from "language"
import {
    ExpandIcon,
    ShrinkIcon,
    ZoomInIcon,
    ZoomOutIcon,
    HorizontalRule,
} from "components"
import { MainSubMenuState } from "redux/menu/index.types"
import {
    handleFitToPage,
    handleResetViewScale,
    handleZoomCenter,
} from "state/view/interface"
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
                onClick={() => handleResetViewScale()}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.MaximizeView" />}
                icon={<ExpandIcon />}
                onClick={() => handleFitToPage()}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.ZoomIn" />}
                icon={<ZoomInIcon />}
                onClick={() => handleZoomCenter(true)}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.View.ZoomOut" />}
                icon={<ZoomOutIcon />}
                onClick={() => handleZoomCenter(false)}
            />
        </MainMenuWrap>
    )
}
export default ViewMenu
