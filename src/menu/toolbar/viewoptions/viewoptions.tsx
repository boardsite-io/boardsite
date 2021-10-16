import React from "react"
import { ExpandIcon, IconButton, ShrinkIcon } from "components"
import store from "redux/store"

const ViewOptions: React.FC = () => (
    <>
        <IconButton
            onClick={() =>
                store.dispatch({
                    type: "RESET_VIEW",
                    payload: undefined,
                })
            }>
            <ShrinkIcon />
        </IconButton>
        <IconButton
            onClick={() =>
                store.dispatch({
                    type: "FIT_WIDTH_TO_PAGE",
                    payload: undefined,
                })
            }>
            <ExpandIcon />
        </IconButton>
    </>
)

export default ViewOptions
