import React from "react"
import { ExpandIcon, IconButton, ShrinkIcon } from "components"
import { FIT_WIDTH_TO_PAGE, RESET_VIEW } from "redux/board/board"
import store from "redux/store"

const ViewOptions: React.FC = () => (
    <>
        <IconButton onClick={() => store.dispatch(RESET_VIEW())}>
            <ShrinkIcon />
        </IconButton>
        <IconButton onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}>
            <ExpandIcon />
        </IconButton>
    </>
)

export default ViewOptions
