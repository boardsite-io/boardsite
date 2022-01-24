import React, { memo } from "react"
import store from "redux/store"
import { useCustomSelector } from "hooks"
import { CSSTransition } from "react-transition-group"
import {
    CLOSE_MAIN_MENU,
    MainMenuState,
    MainSubMenuState,
} from "redux/menu/menu"
import { Popup } from "components"
import { MainMenuDropdown } from "./index.styled"
import FileMenu from "./secondary/file"
import ViewMenu from "./primary/view"
import PageMenu from "./primary/page"
import EditMenu from "./secondary/edit"
import PageStyleMenu from "./secondary/pageStyle"
import PageSizeMenu from "./secondary/pageSize"
import MainMenuBar from "./mainMenuBar"
import GeneralMenu from "./primary/general"
import GoToMenu from "./secondary/goTo"
import SettingsMenu from "./secondary/settings"

const onClickBackground = () => {
    store.dispatch(CLOSE_MAIN_MENU())
}

const cssTransitionProps = {
    unmountOnExit: true,
    timeout: 500,
    classNames: "menu",
}

const MainMenu: React.FC = memo(() => {
    const mainMenuState = useCustomSelector((state) => state.menu.mainMenuState)
    const mainSubMenuState = useCustomSelector(
        (state) => state.menu.mainSubMenuState
    )

    return (
        <>
            <MainMenuBar />
            <Popup
                open={mainMenuState !== MainMenuState.Closed}
                onClose={onClickBackground}
            >
                <MainMenuDropdown open={mainMenuState !== MainMenuState.Closed}>
                    {mainMenuState === MainMenuState.General && <GeneralMenu />}
                    {mainMenuState === MainMenuState.View && <ViewMenu />}
                    {mainMenuState === MainMenuState.Page && <PageMenu />}
                    <CSSTransition
                        in={mainSubMenuState === MainSubMenuState.File}
                        {...cssTransitionProps}
                    >
                        <FileMenu />
                    </CSSTransition>
                    <CSSTransition
                        in={mainSubMenuState === MainSubMenuState.Edit}
                        {...cssTransitionProps}
                    >
                        <EditMenu />
                    </CSSTransition>
                    <CSSTransition
                        in={mainSubMenuState === MainSubMenuState.PageSize}
                        {...cssTransitionProps}
                    >
                        <PageSizeMenu />
                    </CSSTransition>
                    <CSSTransition
                        in={mainSubMenuState === MainSubMenuState.PageStyle}
                        {...cssTransitionProps}
                    >
                        <PageStyleMenu />
                    </CSSTransition>
                    <CSSTransition
                        in={mainSubMenuState === MainSubMenuState.GoTo}
                        {...cssTransitionProps}
                    >
                        <GoToMenu />
                    </CSSTransition>
                    <CSSTransition
                        in={mainSubMenuState === MainSubMenuState.Settings}
                        {...cssTransitionProps}
                    >
                        <SettingsMenu />
                    </CSSTransition>
                </MainMenuDropdown>
            </Popup>
        </>
    )
})

export default MainMenu
