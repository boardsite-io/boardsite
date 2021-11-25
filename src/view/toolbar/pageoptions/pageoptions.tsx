import React from "react"
import store from "redux/store"
import { OPEN_PAGE_ACTIONS } from "redux/menu/menu"
import { IconButton } from "components"
import { BsFileDiff } from "react-icons/bs"

const PageOptions: React.FC = () => (
    <IconButton onClick={() => store.dispatch(OPEN_PAGE_ACTIONS())}>
        <BsFileDiff />
    </IconButton>
)

export default PageOptions
