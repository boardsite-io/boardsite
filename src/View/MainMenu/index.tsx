import React, { memo } from "react"
import { CSSTransition } from "react-transition-group"
import { Popup } from "components"
import { menu, useMenu } from "state/menu"
import { MainMenuState, MainSubMenuState } from "state/menu/state/index.types"
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
import SessionMenu from "./primary/Session"
import SessionSettingsMenu from "./secondary/SessionSettings"

const onClickBackground = () => {
    menu.closeMainMenu()
}

const cssTransitionProps = {
    unmountOnExit: true,
    timeout: 500,
    classNames: "menu",
}

const MainMenu: React.FC = memo(() => {
    const { mainMenuState } = useMenu("mainMenu")
    const { mainSubMenuState } = useMenu("mainSubMenu")

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
                    {mainMenuState === MainMenuState.Session && <SessionMenu />}
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
                    <CSSTransition
                        in={
                            mainSubMenuState ===
                            MainSubMenuState.SessionSettings
                        }
                        {...cssTransitionProps}
                    >
                        <SessionSettingsMenu />
                    </CSSTransition>
                </MainMenuDropdown>
            </Popup>
        </>
    )
})

export default MainMenu
