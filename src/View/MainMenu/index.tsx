import React, { memo } from "react"
import store from "redux/store"
import { useCustomSelector } from "hooks"
import { CSSTransition } from "react-transition-group"
import { CLOSE_MAIN_MENU } from "redux/menu"
import { Popup } from "components"
import { MainMenuState, MainSubMenuState } from "redux/menu/index.types"
import { MainMenuDropdown } from "./index.styled"
import FileMenu from "./secondary/File"
import ViewMenu from "./primary/View"
import PageMenu from "./primary/Page"
import EditMenu from "./secondary/Edit"
import PageStyleMenu from "./secondary/PageStyle"
import PageSizeMenu from "./secondary/PageSize"
import MainMenuBar from "./MainMenuBar"
import GeneralMenu from "./primary/General"
import GoToMenu from "./secondary/GoTo"
import SettingsMenu from "./secondary/Settings"

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
