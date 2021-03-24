import React, { useState } from "react"
import { useSelector } from "react-redux"
import { BsGear } from "react-icons/bs"
import { VscDebugDisconnect } from "react-icons/vsc"

import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Switch,
    TextField,
} from "@material-ui/core"
import {
    TOGGLE_HIDE_NAVBAR,
    TOGGLE_SHOULD_CENTER,
} from "../../../redux/slice/viewcontrol"
import store from "../../../redux/store"
import { SET_API_URL } from "../../../redux/slice/webcontrol"
import { API_URL } from "../../../api/types"
import { isConnected } from "../../../api/websocket"

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

    const keepCentered = useSelector((state) => state.viewControl.keepCentered)
    const hideNavBar = useSelector((state) => state.viewControl.hideNavBar)
    // const apiURL = useSelector((state) => state.webControl.apiURL)

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return
        }
        setOpen(open)
    }

    const handleURLChange = (event) => {
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
