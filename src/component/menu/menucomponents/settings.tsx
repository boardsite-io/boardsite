import React, { useState } from "react"
import { BsGear } from "react-icons/bs"
import { BiStats } from "react-icons/bi"
import { VscDebugDisconnect } from "react-icons/vsc"

import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Slider,
    Switch,
    TextField,
} from "@material-ui/core"
import {
    TOGGLE_HIDE_NAVBAR,
    TOGGLE_SHOULD_CENTER,
} from "../../../redux/slice/viewcontrol"
import {
    SET_SAMPLE_COUNT,
    TOGGLE_DIRECTDRAW,
} from "../../../redux/slice/drawcontrol"
import store from "../../../redux/store"
import { SET_API_URL } from "../../../redux/slice/webcontrol"
import { API_URL } from "../../../api/types"
import { isConnected } from "../../../api/websocket"
import { useCustomSelector } from "../../../redux/hooks"

const useStyles = makeStyles({
    paper: {
        width: "250px",
    },
})

export default function SettingsButton() {
    const classes = useStyles()
    const [isOpen, setOpen] = useState(false)
    const [url, setURL] = useState(API_URL)
    const [isValidURL, setValidURL] = useState(true)

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

    const toggleDrawer = (open: boolean) => (event: any) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return
        }
        setOpen(open)
    }

    const handleURLChange = (event: any) => {
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
            <button type="button" id="icon-button" onClick={toggleDrawer(true)}>
                <BsGear id="icon" />
            </button>

            <Drawer
                anchor="left"
                open={isOpen}
                onClose={toggleDrawer(false)}
                classes={{ paper: classes.paper }}>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <BsGear />
                        </ListItemIcon>
                        <ListItemText primary="General Settings" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Keep view centered" />
                        <Switch
                            checked={keepCentered}
                            onChange={() =>
                                store.dispatch(TOGGLE_SHOULD_CENTER())
                            }
                            name="jason"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Hide navigation bar" />
                        <Switch
                            checked={hideNavBar}
                            onChange={() =>
                                store.dispatch(TOGGLE_HIDE_NAVBAR())
                            }
                            name="jason"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Enable Direct Drawing" />
                        <Switch
                            checked={directDraw}
                            onChange={() => store.dispatch(TOGGLE_DIRECTDRAW())}
                            name="jason"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <BiStats />
                        </ListItemIcon>
                        <ListItemText primary="Sampling Period" />
                    </ListItem>
                    <ListItem>
                        <Slider
                            defaultValue={
                                store.getState().drawControl.samplesRequired
                            }
                            getAriaValueText={(val) => {
                                store.dispatch(SET_SAMPLE_COUNT(val))
                                return ""
                            }}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks={[
                                { value: 1, label: "Min" },
                                { value: 5, label: "Max" },
                            ]}
                            min={1}
                            max={5}
                        />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <VscDebugDisconnect />
                        </ListItemIcon>
                        <ListItemText primary="Connection" />
                    </ListItem>
                    <ListItem>
                        <TextField
                            id="standard-basic"
                            label="Custom API Server URL"
                            inputMode="url"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            helperText="e.g. https://api.boardsite.io"
                            value={url.toString()}
                            onChange={handleURLChange}
                            error={!isValidURL}
                            disabled={isConnected()}
                        />
                    </ListItem>
                </List>
            </Drawer>
        </>
    )
}
