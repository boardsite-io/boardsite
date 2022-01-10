import { FormattedMessage } from "language"
import React, { useState } from "react"
import store from "redux/store"
import { BsGear, BsInfoCircle } from "react-icons/bs"
import isElectron from "is-electron"
import { VscDebugDisconnect } from "react-icons/vsc"
import {
    Button,
    Drawer,
    DrawerContent,
    DrawerTitle,
    Switch,
    TextField,
} from "components"
import { TOGGLE_HIDE_NAVBAR, TOGGLE_SHOULD_CENTER } from "redux/board/board"
import { TOGGLE_DIRECTDRAW } from "redux/drawing/drawing"
import { currentSession, isConnected } from "api/session"
import { useCustomSelector } from "hooks"
import { API_URL } from "api/types"
import isDev from "consts"
import { CLOSE_SETTINGS, OPEN_ABOUT } from "redux/menu/menu"
import { Setting } from "./index.styled"

const SettingsMenu: React.FC = () => {
    const [url, setURL] = useState(API_URL)
    const [isValidURL, setValidURL] = useState(true)
    // const [isOpenAbout, setOpenAbout] = useState(false) // about dialog

    const settingsOpen = useCustomSelector((state) => state.menu.settingsOpen)
    const { keepCentered, hideNavBar } = useCustomSelector(
        (state) => state.board.stage
    )
    const { directDraw } = useCustomSelector((state) => state.drawing)
    // const apiURL = useAppSelector((state) => state.webControl.apiURL)

    const handleURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setURL(event.target.value)
        try {
            currentSession().setAPIURL(new URL(event.target.value))
            setValidURL(true)
        } catch {
            setValidURL(false)
        }
    }

    return (
        <Drawer
            open={settingsOpen}
            onClose={() => store.dispatch(CLOSE_SETTINGS())}>
            <DrawerTitle>
                <BsGear id="transitory-icon" />
                <FormattedMessage id="SettingsMenu.GeneralSettings.Title" />
            </DrawerTitle>
            <DrawerContent>
                <Setting>
                    <FormattedMessage id="SettingsMenu.GeneralSettings.KeepCentered" />
                    <Switch
                        enabled={keepCentered}
                        onClick={() => store.dispatch(TOGGLE_SHOULD_CENTER())}
                    />
                </Setting>
                <Setting>
                    <FormattedMessage id="SettingsMenu.GeneralSettings.HideNavigationBar" />
                    <Switch
                        enabled={hideNavBar}
                        onClick={() => store.dispatch(TOGGLE_HIDE_NAVBAR())}
                    />
                </Setting>
                <Setting>
                    <FormattedMessage id="SettingsMenu.GeneralSettings.EnableDirectDrawing" />
                    <Switch
                        enabled={directDraw}
                        onClick={() => store.dispatch(TOGGLE_DIRECTDRAW())}
                    />
                </Setting>
            </DrawerContent>
            <DrawerTitle>
                <VscDebugDisconnect id="transitory-icon" />
                <FormattedMessage id="SettingsMenu.Connection.Title" />
            </DrawerTitle>
            <DrawerContent>
                <Setting>
                    <TextField
                        label={<FormattedMessage id="ApiUrlLabel" />}
                        inputMode="url"
                        value={url.toString()}
                        onChange={handleURLChange}
                        error={!isValidURL}
                        disabled={isConnected() || (!isDev() && !isElectron())}
                        align="left"
                    />
                </Setting>
            </DrawerContent>
            <DrawerTitle>
                <BsInfoCircle id="transitory-icon" />
                <FormattedMessage id="SettingsMenu.About.Title" />
            </DrawerTitle>
            <DrawerContent>
                <Setting>
                    <Button
                        withIcon
                        fullWidth
                        onClick={() => {
                            store.dispatch(CLOSE_SETTINGS())
                            store.dispatch(OPEN_ABOUT())
                        }}>
                        <BsInfoCircle id="transitory-icon" />
                        <FormattedMessage id="SettingsMenu.About.Button" />
                    </Button>
                </Setting>
            </DrawerContent>
        </Drawer>
    )
}

export default SettingsMenu
