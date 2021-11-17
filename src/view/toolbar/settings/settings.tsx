import React, { useState } from "react"
import { BsGear, BsInfoCircle } from "react-icons/bs"
import isElectron from "is-electron"
import { VscDebugDisconnect } from "react-icons/vsc"
import store from "redux/store"
import {
    Button,
    Drawer,
    DrawerContent,
    DrawerTitle,
    IconButton,
    Switch,
    TextField,
} from "components"
import { SET_API_URL } from "redux/session/session"
import { TOGGLE_HIDE_NAVBAR, TOGGLE_SHOULD_CENTER } from "redux/board/board"
import { TOGGLE_DIRECTDRAW } from "redux/drawing/drawing"
import { isConnected } from "api/websocket"
import { useCustomSelector } from "redux/hooks"
import { API_URL } from "api/types"
import isDev from "consts"
import About from "../about/about"
import { Setting } from "./settings.styled"

const Settings: React.FC = () => {
    const [isOpen, setOpen] = useState(false)
    const [url, setURL] = useState(API_URL)
    const [isValidURL, setValidURL] = useState(true)
    const [isOpenAbout, setOpenAbout] = useState(false) // about dialog

    const { keepCentered, hideNavBar } = useCustomSelector(
        (state) => state.board.view
    )
    const { directDraw } = useCustomSelector((state) => state.drawing)
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
                <DrawerTitle>
                    <BsGear />
                    General Settings
                </DrawerTitle>
                <DrawerContent>
                    <Setting>
                        Keep view centered
                        <Switch
                            enabled={keepCentered}
                            onClick={() =>
                                store.dispatch(TOGGLE_SHOULD_CENTER())
                            }
                        />
                    </Setting>
                    <Setting>
                        Hide navigation bar
                        <Switch
                            enabled={hideNavBar}
                            onClick={() => store.dispatch(TOGGLE_HIDE_NAVBAR())}
                        />
                    </Setting>
                    <Setting>
                        Enable Direct Drawing
                        <Switch
                            enabled={directDraw}
                            onClick={() => store.dispatch(TOGGLE_DIRECTDRAW())}
                        />
                    </Setting>
                </DrawerContent>
                <DrawerTitle>
                    <VscDebugDisconnect />
                    Connection
                </DrawerTitle>
                <DrawerContent>
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
                </DrawerContent>
                <DrawerTitle>
                    <BsInfoCircle />
                    About
                </DrawerTitle>
                <DrawerContent>
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
                </DrawerContent>
            </Drawer>
            <About isOpen={isOpenAbout} setOpen={setOpenAbout} />
        </>
    )
}

export default Settings
