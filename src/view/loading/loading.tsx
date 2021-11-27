import { Dialog, DialogContent } from "components"
import React from "react"
import { useCustomSelector } from "hooks"
import { END_LOADING } from "redux/loading/loading"
import store from "redux/store"

const Loading: React.FC = () => {
    const { isLoading, message } = useCustomSelector((state) => state.info)
    const onClose = () => {
        store.dispatch(END_LOADING())
    }

    return (
        <Dialog open={isLoading} onClose={onClose}>
            <DialogContent>{message}</DialogContent>
        </Dialog>
    )
}

export default Loading
