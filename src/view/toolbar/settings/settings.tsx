import React from "react"
import { BsGear } from "react-icons/bs"
import store from "redux/store"
import { IconButton } from "components"
import { OPEN_SETTINGS } from "redux/menu/menu"

const Settings: React.FC = () => (
    <IconButton onClick={() => store.dispatch(OPEN_SETTINGS())}>
        <BsGear id="icon" />
    </IconButton>
)

export default Settings
