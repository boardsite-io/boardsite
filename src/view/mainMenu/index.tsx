import React, { memo } from "react"
import store from "redux/store"
import { useCustomSelector } from "hooks"
import { CSSTransition } from "react-transition-group"
import {
    CLOSE_MAIN_MENU,
    MainMenuState,
    MainSubMenuState,
} from "redux/menu/menu"
import { MainMenuDropdown, MainMenuBackground } from "./index.styled"
import FileMenu from "./fileMenu"
import ViewMenu from "./viewMenu"
import PageMenu from "./pageMenu"
import EditMenu from "./editMenu"
import PageStyleMenu from "./pageStyleMenu"
import PageSizeMenu from "./pageSizeMenu"
import MainMenuBar from "./mainMenuBar"
import GeneralMenu from "./generalMenu"

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
            <MainMenuBackground
                open={mainMenuState !== MainMenuState.Closed}
                onClick={onClickBackground}
            />
            <MainMenuDropdown open={mainMenuState !== MainMenuState.Closed}>
                {mainMenuState === MainMenuState.General && <GeneralMenu />}
                {mainMenuState === MainMenuState.View && <ViewMenu />}
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
                    in={mainSubMenuState === MainSubMenuState.Page}
                    {...cssTransitionProps}
                >
                    <PageMenu />
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
            </MainMenuDropdown>
        </>
    )
})

export default MainMenu
