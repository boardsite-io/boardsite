import { Dialog, DialogContent } from "components"
import React from "react"
import { useCustomSelector } from "redux/hooks"
import store from "redux/store"

const Loading: React.FC = () => {
    const { isLoading, message } = useCustomSelector((state) => state.loading)
    const onClose = () => {
        store.dispatch({ type: "END_LOADING", payload: undefined })
    }

    return (
        <Dialog open={isLoading} onClose={onClose}>
            <DialogContent>{message}</DialogContent>
        </Dialog>
    )
}

export default Loading
