import React, { useState } from "react"
import { BsGear, BsInfoCircle } from "react-icons/bs"
import isElectron from "is-electron"
import { VscDebugDisconnect } from "react-icons/vsc"
import { Switch } from "@material-ui/core"
import store from "redux/store"
import { Button, Drawer, IconButton, TextField } from "components"
import { SET_API_URL } from "redux/slice/webcontrol"
import {
    TOGGLE_HIDE_NAVBAR,
    TOGGLE_SHOULD_CENTER,
} from "redux/slice/viewcontrol"
import { TOGGLE_DIRECTDRAW } from "redux/slice/drawcontrol"
import { isConnected } from "api/websocket"
import { useCustomSelector } from "redux/hooks"
import { API_URL } from "../../../api/types"
import isDev from "../../../constants"
import About from "../about/about"
import { Setting, SettingsGroup, SettingsTitle } from "./settings.styled"

const Settings: React.FC = () => {
    const [isOpen, setOpen] = useState(false)
    const [url, setURL] = useState(API_URL)
    const [isValidURL, setValidURL] = useState(true)
    const [isOpenAbout, setOpenAbout] = useState(false) // about dialog

    const keepCentered = useCustomSelector(
        (state) => state.viewControl.keepCentered
    )
    const hideNavBar = useCustomSelector(
        (state) => state.viewControl.hideNavBar
    )
    const directDraw = useCustomSelector(
        (state) => state.drawControl.directDraw
    )
    // const apiURL = useAppSelector((state) => state.webControl.apiURL)

    const handleURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setURL(event.target.value)
        try {
            const u = new URL(event.target.value)
            store.dispatch(SET_API_URL(u))
            setValidURL(true)
        } catch {
            setValidURL(false)
        }
    }

    return (
        <>
            <IconButton onClick={() => setOpen(true)}>
                <BsGear id="icon" />
            </IconButton>
            <Drawer open={isOpen} onClose={() => setOpen(false)}>
                <SettingsTitle>
                    <BsGear />
                    General Settings
                </SettingsTitle>
                <SettingsGroup>
                    <Setting>
                        Keep view centered
                        <Switch
                            checked={keepCentered}
                            onChange={() =>
                                store.dispatch(TOGGLE_SHOULD_CENTER())
                            }
                            name="jason"
                        />
                    </Setting>
                    <Setting>
                        Hide navigation bar
                        <Switch
                            checked={hideNavBar}
                            onChange={() =>
                                store.dispatch(TOGGLE_HIDE_NAVBAR())
                            }
                            name="jason"
                        />
                    </Setting>
                    <Setting>
                        Enable Direct Drawing
                        <Switch
                            checked={directDraw}
                            onChange={() => store.dispatch(TOGGLE_DIRECTDRAW())}
                            name="jason"
                        />
                    </Setting>
                </SettingsGroup>
                <SettingsTitle>
                    <VscDebugDisconnect />
                    Connection
                </SettingsTitle>
                <SettingsGroup>
                    <Setting>
                        <TextField
                            label="API URL"
                            inputMode="url"
                            value={url.toString()}
                            onChange={handleURLChange}
                            error={!isValidURL}
                            disabled={
                                isConnected() || (!isDev() && !isElectron())
                            }
                            align="left"
                        />
                    </Setting>
                </SettingsGroup>
                <SettingsTitle>
                    <BsInfoCircle />
                    About
                </SettingsTitle>
                <SettingsGroup>
                    <Setting>
                        <Button
                            withIcon
                            fullWidth
                            onClick={() => {
                                setOpen(false)
                                setOpenAbout(true)
                            }}>
                            <BsInfoCircle />
                            About boardsite.io
                        </Button>
                    </Setting>
                </SettingsGroup>
            </Drawer>
            <About isOpen={isOpenAbout} setOpen={setOpenAbout} />
        </>
    )
}

export default Settings
