import React, { memo } from "react"
import { Popup } from "components"
import { menu, useMenu } from "state/menu"
import { MainMenuState } from "state/menu/state/index.types"
import { MainMenuDropdown } from "./index.styled"
import ViewMenu from "./menu/View"
import PageMenu from "./menu/Page"
import MainMenuBar from "./MainMenuBar"
import GeneralMenu from "./menu/General"
import SessionMenu from "./menu/Session"

const onClickBackground = () => {
    menu.closeMainMenu()
}

const MainMenu: React.FC = memo(() => {
    const { mainMenuState } = useMenu("mainMenu")

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
                </MainMenuDropdown>
            </Popup>
        </>
    )
})

export default MainMenu
